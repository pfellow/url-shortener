import { headers } from 'next/headers';

import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const POST = async (request) => {
  const data = await request.json();
  const userData = { useragent: headers().get('user-agent') };
  if (data.referrer) {
    userData.referrer = data.referrer;
  }
  let ip = data.userIp;
  if (!ip) {
    ip = headers().get('x-forwarded-for') || headers().get('x-real-ip');
  }
  userData.ip = ip;

  // retriving link from DB and writing a userclick

  try {
    connectToDB();
    const foundUrl = await ShortUrl.findById(data.urlId);

    if (!foundUrl) {
      throw new Error('Incorrect url id');
    }
    foundUrl.clicks.push(userData);
    foundUrl.save();
  } catch (error) {
    console.log('Could not write a userlick in DB ', error.message);
  }

  return new Response('OK');
};
