import { nanoid } from 'nanoid/non-secure';
import jwt from 'jsonwebtoken';

import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';
import BlockedDomain from '@models/blockedDomain';
import { headers } from 'next/headers';

export const POST = async (request: any) => {
  const data = await request.json();

  const sanitizedData: any = {};

  // Checking guestId

  if (!data.guestId || !data.token) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Authorization failed. Please reload the page.'
      }),
      {
        status: 401
      }
    );
  }

  let decodedToken: any = {};
  try {
    decodedToken = jwt.verify(
      data.token,
      process.env.JWT_SECRET_KEY_SIMPLE as string
    );
    if (!decodedToken || decodedToken.guestId !== data.guestId) {
      throw new Error(
        'Authorization failed. Clear the cache and reload the page.'
      );
    } else {
      if (decodedToken.exp * 1000 >= Date.now()) {
        sanitizedData.guestId = decodedToken.guestId;
      } else {
        throw new Error('Token expired. Please reload the page.');
      }
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message
      }),
      {
        status: 401
      }
    );
  }

  // Checking that the link is URL and it is not already shortened link
  let domain;
  try {
    domain = new URL(data.fullurl);

    if (domain.hostname === process.env.DOMAIN) {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Shortened links can not be shortened again!'
        }),
        {
          status: 403
        }
      );
    }
    connectToDB();
    const blockedDomain = await BlockedDomain.findOne({
      domain: domain.hostname
    });
    if (blockedDomain) {
      throw new Error('Could not shorten this link as it seems unsafe.');
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Seems like this URL is not correct or not allowed.'
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
        data.since <= Date.UTC(2050, 1)
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
        data.till <= Date.UTC(2050, 1)
      ) {
        sanitizedData.till = data.till;
      } else {
        throw new Error('Valid Till');
      }
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Incorrect data provided: ' + error.message
      }),
      {
        status: 422
      }
    );
  }

  // Checking if the url is already in DB

  try {
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
            status: 'error',
            message:
              'This url has been shortened previosly. You can use this link or create another one with a custom name.',
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
  } catch (error: any) {
    console.log(data.fullurl + ' ' + error.message);
    if (error.message !== 'This operation was aborted') {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Seems like this URL is not correct or not allowed.'
        }),
        {
          status: 403
        }
      );
    }
  }

  // Google Safe Browsing

  const safeBrResponse = await fetch(process.env.GOOGLE_SAFEBR_API as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client: {
        clientId: 'ogo.gl',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: [
          'THREAT_TYPE_UNSPECIFIED',
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [
          {
            url: data.fullurl
          }
        ]
      }
    })
  });
  const safeBrData = await safeBrResponse.json();
  console.log('CHECKING SAFE BROWSING');
  if (safeBrData.matches) {
    fetch(process.env.ENV_URL + '/api/blockedDomain/', {
      method: 'PUT',
      body: JSON.stringify({ url: data.fullurl, reason: 'Safebrowsing check' }),
      headers: { 'Content-Type': 'application/json' }
    });

    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Could not shorten this link as it seems unsafe.'
      }),
      {
        status: 403
      }
    );
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
  // fetch(process.env.ENV_URL + '/api/blockedDomain/', {
  //   method: 'PUT',
  //   body: JSON.stringify({ url: data.fullurl, reason: "IPquality check" }),
  //   headers: { 'Content-Type': 'application/json' }
  // });
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
          status: 'error',
          message: 'Could not generate a short URL. Please try again later'
        }),
        { status: 500 }
      );
    }
  }

  // Getting ip of the creator

  const ip = headers().get('x-forwarded-for') || headers().get('x-real-ip');
  if (ip) {
    sanitizedData.creatorIp = ip;
  }

  // Writing to DB

  try {
    connectToDB();
    const shortUrlObj = new ShortUrl(sanitizedData);
    await shortUrlObj.save();

    // Deleting unnessesary info:

    delete sanitizedData.guestId;
    delete sanitizedData.creatorIp;

    return new Response(
      JSON.stringify({ status: 'ok', shortUrlObj: sanitizedData }),
      {
        status: 200
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Failed to shorten this URl! '
      }),
      {
        status: 500
      }
    );
  }
};
