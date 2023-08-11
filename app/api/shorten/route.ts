import { nanoid } from 'nanoid/non-secure';
import jwt from 'jsonwebtoken';

import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const POST = async (request: any) => {
  const data = await request.json();

  const sanitizedData = {};

  // Checking userId

  if (!data.userId || !data.token) {
    return new Response(
      JSON.stringify({
        error: 'Authorization failed. Please reload the page.'
      }),
      {
        status: 401
      }
    );
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(data.token, process.env.JWT_SECRET_KEY_SIMPLE);
    if (!decodedToken || decodedToken.userId !== data.userId) {
      throw new Error(
        'Authorization failed. Clear the cache and reload the page.'
      );
    } else {
      sanitizedData.userId = decodedToken.userId;
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 401
      }
    );
  }

  // Checking that the link is URL and it is not already shortened link

  try {
    const domain = new URL(data.fullurl);

    if (domain.hostname === process.env.DOMAIN) {
      return new Response(
        JSON.stringify({
          error: 'Shortened links can not be shortened again!'
        }),
        {
          status: 403
        }
      );
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: 'Seems like this URL is not correct or not allowed.'
      }),
      {
        status: 403
      }
    );
  }
  sanitizedData.fullurl = data.fullurl;

  // Validating and sanitizing data

  try {
    if (data.custom) {
      if (/^([a-zA-z0-9]{3,12})$/.test(data.custom)) {
        connectToDB();
        const foundUrl = await ShortUrl.findOne({
          shorturl: data.custom
        }).select('_id');
        if (foundUrl !== null) {
          throw new Error('This custom link is not available.');
        } else {
          sanitizedData.shorturl = data.custom;
        }
      } else {
        throw new Error('Custom Link');
      }
    }
    if (data.linkpass) {
      if (
        data.linkpass.toString().length >= 3 &&
        data.linkpass.toString().length <= 18
      ) {
        sanitizedData.linkpass = data.linkpass.toString();
      } else {
        throw new Error('Link Password');
      }
    }
    if (+data.maxclicks) {
      if (+data.maxclicks > 0 && +data.maxclicks % 1 === 0) {
        sanitizedData.maxclicks = +data.maxclicks;
      } else {
        throw new Error('Max Clicks');
      }
    }
    if (data.since) {
      const serverUTCTime = Date.now();

      if (
        data.since >= serverUTCTime - 5 * 60000 &&
        data.since <= Date.UTC(2050)
      ) {
        sanitizedData.since = data.since;
      } else {
        throw new Error('Valid Since');
      }
    }
    if (data.till) {
      const serverUTCTime = Date.now();

      if (
        data.till >= (data.since || serverUTCTime) &&
        data.till <= Date.UTC(2050)
      ) {
        sanitizedData.till = data.till;
      } else {
        throw new Error('Valid Till');
      }
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Incorrect data provided: ' + error.message
      }),
      {
        status: 422
      }
    );
  }

  // Checking if the url is already in DB

  try {
    connectToDB();

    const foundUrl = await ShortUrl.findOne({ fullurl: data.fullurl });

    if (foundUrl !== null) {
      // Cheching that in the saved version and in the new data there are custom fields

      if (
        !(
          data.custom ||
          data.linkpass ||
          data.maxclicks ||
          data.since ||
          data.till ||
          foundUrl.custom ||
          foundUrl.linkpass ||
          foundUrl.maxclicks ||
          foundUrl.since ||
          foundUrl.till
        )
      ) {
        return new Response(
          JSON.stringify({
            shortUrlObj: {
              fullurl: foundUrl.fullurl,
              shorturl: foundUrl.shorturl
            }
          }),
          {
            status: 200
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }

  // Checking that the link returns something

  try {
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => {
      // waiting 3 seconds before giving up
      controller.abort();
    }, 3000);
    await fetch(data.fullurl, { signal });
  } catch (error) {
    console.log(data.fullurl + ' ' + error.message);
    if (error.message !== 'This operation was aborted') {
      return new Response(
        JSON.stringify({
          error: 'Seems like this URL is not correct or not allowed.'
        }),
        {
          status: 403
        }
      );
    }
  }

  // Checking that the link is not maliscious

  // try {
  //   const checkURLResponse = await fetch(
  //     `https://www.ipqualityscore.com/api/json/url/${
  //       process.env.IP_QUALITY_API_KEY
  //     }/${encodeURIComponent(data.fullurl)}`
  //   );

  //   const checkURLData = await checkURLResponse.json();

  //   if (
  //     checkURLData.unsafe ||
  //     checkURLData.spamming ||
  //     checkURLData.malware ||
  //     checkURLData.phishing ||
  //     checkURLData.suspicious ||
  //     checkURLData.risk_score >= 85
  //   ) {
  //     return new Response(
  //       JSON.stringify({
  //         error: 'Could not shorten this link as it seems unsafe.'
  //       }),
  //       {
  //         status: 403
  //       }
  //     );
  //   }
  // } catch (error) {
  //   console.log(error);
  // }

  // Generating a unique shorturl and checking if it is unique

  while (!sanitizedData.shorturl) {
    let shorturl = nanoid(6);
    try {
      const foundUrl = await ShortUrl.findOne({ shorturl }).select('_id');
      if (foundUrl === null) {
        sanitizedData.shorturl = shorturl;
      }
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Could not generate a short URL. Please try again later'
        }),
        { status: 500 }
      );
    }
  }

  // Writing to DB

  try {
    connectToDB();
    const shortUrlObj = new ShortUrl(sanitizedData);
    await shortUrlObj.save();

    return new Response(JSON.stringify({ shortUrlObj: sanitizedData }), {
      status: 200
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to shorten this URl! ' }),
      {
        status: 500
      }
    );
  }
};
