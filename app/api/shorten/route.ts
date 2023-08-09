import { nanoid } from 'nanoid';

import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const POST = async (request: any) => {
  const { url, userId } = await request.json();

  try {
    connectToDB();
    const shortUrlObj = new ShortUrl({
      fullurl: url,
      shorturl: nanoid(6),
      userId
    });
    const shortURL = await shortUrlObj.save();

    return new Response(JSON.stringify({ shortURL }), {
      status: 200
    });
  } catch (error) {
    return new Response('Failed to shorten this URl!', { status: 500 });
  }
};
