import { headers } from 'next/headers';

import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const POST = async (request) => {
  const data = await request.json();
  // useragent
  const userData = { useragent: headers().get('user-agent') };

  // referrer

  if (data.referrer) {
    userData.referrer = data.referrer;
  }

  // userdata

  const userdata = {};

  for (const [key, value] of Object.entries(data.userData)) {
    if (key === 'query') {
      userdata.ip = value;
    } else if (value !== '' && key !== 'status') {
      userdata[key] = value;
    }
  }

  userData.userdata = userdata;

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
