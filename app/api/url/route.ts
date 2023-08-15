import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const POST = async (request: any) => {
  const { guestId } = await request.json();

  try {
    connectToDB();
    let urls = await ShortUrl.find({ guestId })
      .sort({ _id: -1 })
      .limit(10)
      .select('fullurl shorturl clicks -_id');

    urls = urls.map((url) => {
      return {
        fullurl: url.fullurl,
        shorturl: url.shorturl,
        clicks: url.clicks.length
      };
    });

    return new Response(JSON.stringify({ urls }), {
      status: 200
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: "Could not fetch user's urls"
      }),
      { status: 500 }
    );
  }
};
