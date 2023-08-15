import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';

export const POST = async (request: any) => {
  const data = await request.json();
  //   console.log(data);

  try {
    if (!data.type || !/^([a-zA-z0-9]{3,12})$/.test(data.linkId)) {
      throw new Error('Incorrect input data provided.', {
        cause: {
          status: 422,
          message: 'Incorrect input data provided.'
        }
      });
    }
    let searchParam;
    switch (data.type) {
      case 'general':
      case 'bymonth':
      //https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/month/
      case 'byday':
      case 'byhour':
      case 'countries':
        searchParam = '$clicks.userdata.country';
        break;
      case 'regions':
        searchParam = '$clicks.userdata.region';
        break;
      case 'districts':
        searchParam = '$clicks.userdata.district';
        break;
      case 'cities':
        searchParam = '$clicks.userdata.city';
        break;
      case 'browsers':
        searchParam = '$clicks.userdata.browser';
        break;
      case 'platforms':
        searchParam = '$clicks.userdata.platform';
        break;
      case 'devices':
        searchParam = '$clicks.userdata.device';
        break;
      case 'referrers':
        searchParam = '$clicks.referrer';
        break;
      default:
    }
    console.log(searchParam);

    connectToDB();

    const urlData = await ShortUrl.aggregate([
      { $match: { shorturl: data.linkId } },
      { $unwind: '$clicks' },
      {
        $match: {
          'clicks.date': {
            $gte: new Date(data.since),
            $lte: new Date(data.until || '2050')
          }
        }
      },
      {
        $group: {
          _id: `${searchParam}`,
          count: { $count: {} }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    return new Response(
      JSON.stringify({
        status: 'OK',
        data: urlData
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message:
          error.message ||
          error?.cause?.message || // delete error.message
          'Something went wrong while fetching statistics'
      }),
      { status: error?.cause?.status || 500 }
    );
  }
};
