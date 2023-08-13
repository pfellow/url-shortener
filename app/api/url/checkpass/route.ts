import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const POST = async (request) => {
  const data = await request.json();

  try {
    if (
      data.userPass.toString().length < 3 ||
      data.userPass.toString().length > 18
    ) {
      throw new Error('Incorrect password!', {
        cause: { status: 401, message: 'Incorrect password!' }
      });
    }

    connectToDB();
    const foundUrl = await ShortUrl.findById(data.id);

    if (foundUrl === null || !foundUrl.linkpass) {
      throw new Error('Could not find the url or the url data is incorrect!', {
        cause: {
          status: 404,
          message: 'Could not find the url or the url data is incorrect!'
        }
      });
    }
    if (foundUrl.linkpass !== data.userPass) {
      throw new Error('Incorrect password', {
        cause: { status: 401, message: 'Incorrect password!' }
      });
    } else {
      return new Response(
        JSON.stringify({
          status: 'OK',
          url: { id: foundUrl._id, fullurl: foundUrl.fullurl }
        }),
        {
          status: 200
        }
      );
    }
  } catch (error) {
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
