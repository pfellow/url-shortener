import bcrypt from 'bcrypt';

import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const GET = async (request: any, { params }: any) => {
  try {
    connectToDB();
    const foundUrl = await ShortUrl.findOne({ shorturl: params.id });

    if (foundUrl === null)
      return new Response(
        JSON.stringify({ error: 'Could not find the url.' }),
        {
          status: 404
        }
      );

    const url = {
      since: foundUrl.since,
      till: foundUrl.till,
      maxclicks: foundUrl.maxclicks,
      fullurl: foundUrl.fullurl,
      id: foundUrl._id,
      hash: foundUrl.linkpass ? await bcrypt.hash(foundUrl.linkpass, 12) : ''
    };

    return new Response(JSON.stringify({ url }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: 'Something went wrong while fetching the url data.'
      }),
      { status: 500 }
    );
  }
};
