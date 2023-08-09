import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const GET = async (request: any, { params }) => {
  try {
    connectToDB();
    const url = await ShortUrl.findOne({ shorturl: params.id });

    if (url === null)
      return new Response('This link does not exist!', { status: 404 });

    url.clicks++;
    url.save();

    return new Response(JSON.stringify({ url }), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};
