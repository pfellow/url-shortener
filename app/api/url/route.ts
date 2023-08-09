import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const POST = async (request: any) => {
  const { userId } = await request.json();

  try {
    connectToDB();
    const urls = await ShortUrl.find({ userId: userId }).limit(10);

    return new Response(JSON.stringify({ urls }), {
      status: 200
    });
  } catch (error) {
    return new Response('Failed to shorten this URl!', { status: 500 });
  }
};
