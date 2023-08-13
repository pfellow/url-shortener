import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const GET = async (request: any, { params }: any) => {
  try {
    connectToDB();
    const foundUrl = await ShortUrl.findOne({ shorturl: params.id });

    if (foundUrl === null) {
      throw new Error('This link is not valid!', {
        cause: { status: 404, message: 'This link is not valid!' }
      });
    }

    // checking for the custom fields

    if (foundUrl.since && foundUrl.since > Date.now()) {
      throw new Error('This link is not available yet', {
        cause: { status: 403, message: 'This link is not available yet' }
      });
    }
    if (foundUrl.till && foundUrl.till < Date.now()) {
      throw new Error(
        `This link was available before ${new Date(
          foundUrl.till
        ).toUTCString()}`,
        {
          cause: {
            status: 403,
            message: `This link was available before ${new Date(
              foundUrl.till
            ).toUTCString()}`
          }
        }
      );
    }
    if (foundUrl.maxclicks && foundUrl.clicks.length >= foundUrl.maxclicks) {
      throw new Error(
        'This link is no longer avaliable. The number of clicks is exceeded.',
        {
          cause: {
            status: 403,
            message:
              'This link is no longer avaliable. The number of clicks is exceeded.'
          }
        }
      );
    }

    if (foundUrl.linkpass) {
      return new Response(
        JSON.stringify({ status: 'protected', url: { id: foundUrl._id } }),
        {
          status: 200
        }
      );
    }

    const url = {
      fullurl: foundUrl.fullurl,
      id: foundUrl._id
    };

    return new Response(JSON.stringify({ status: 'OK', url }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        status: 'error',
        message:
          error?.cause?.message ||
          'Something went wrong while fetching the url!'
      }),
      {
        status: error?.cause?.status || 500
      }
    );
  }
};
