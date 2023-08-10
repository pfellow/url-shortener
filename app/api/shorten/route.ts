import { nanoid } from 'nanoid';

import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const POST = async (request: any) => {
  const data = await request.json();
  const { url, custom, linkpass, maxclicks, since, till, userId } = data;
  console.log(data);

  // Checking that the link is URL and it is not already shortened link

  try {
    const domain = new URL(url);

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

  // Checking if the url is already in DB

  try {
    connectToDB();

    const foundUrl = await ShortUrl.findOne({ fullurl: url });

    if (foundUrl !== null) {
      return new Response(JSON.stringify({ shortUrlObj: foundUrl }), {
        status: 200
      });
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
    const result = await fetch(url, { signal });
  } catch (error) {
    console.log(url + ' ' + error.message);
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
  //     }/${encodeURIComponent(url)}`
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

  let shorturl = nanoid(6);

  while (true) {
    try {
      const foundUrl = await ShortUrl.findOne({ shorturl });
      if (foundUrl === null) {
        break;
      }
      shorturl = nanoid(6);
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
    const shortUrlObj = new ShortUrl({
      fullurl: url,
      shorturl,
      userId,
      custom,
      linkpass,
      maxclicks,
      since,
      till
    });
    shortUrlObj.save();

    return new Response(JSON.stringify({ shortUrlObj }), { status: 200 });
  } catch (error) {
    return new Response('Failed to shorten this URl!', { status: 500 });
  }
};
