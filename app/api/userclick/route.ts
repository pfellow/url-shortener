import { headers } from 'next/headers';
import UAParser from 'ua-parser-js';

import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const POST = async (request) => {
  const data = await request.json();
  const userData = {};

  // useragent: Browser, OS, Device

  const parser = new UAParser(headers().get('user-agent'));
  const uaparsed = parser.getResult();
  const userdata = {};

  if (uaparsed?.browser?.name) {
    userdata.browser = `${uaparsed.browser.name} ${uaparsed.browser.major}`;
  }
  if (uaparsed?.os?.name) {
    userdata.os = `${uaparsed.os.name} ${uaparsed.os.version}`;
  }
  if (uaparsed?.device?.type) {
    userdata.platform = uaparsed.device.type;
  }
  if (uaparsed?.device?.model) {
    userdata.device = `${uaparsed.device.vendor} ${uaparsed.device?.model}`;
  }

  // referrer

  if (data.referrer) {
    userData.referrer = data.referrer;
  }

  // City, Country, Region, District, ip

  for (const [key, value] of Object.entries(data.userData)) {
    if (key === 'query') {
      userdata.ip = value;
    } else if (key === 'regionName') {
      userdata.region = value;
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
