import { connectToDB } from '@utils/database';
import ShortUrl from '@models/shortUrl';
import { PipelineStage } from 'mongoose';

export const POST = async (request: any) => {
  const data = await request.json();

  try {
    if (!data.type || !/^([a-zA-z0-9]{3,12})$/.test(data.linkId)) {
      throw new Error('Incorrect input data provided.', {
        cause: {
          status: 422,
          message: 'Incorrect input data provided.'
        }
      });
    }
    let query = [];
    let dates = { $match: {} };

    if (data.since) {
      if (data.till) {
        if (data.till <= data.since) {
          throw new Error('"Period until" should be later than "Period from"', {
            cause: {
              status: 422,
              message: '"Period until" should be later than "Period from"'
            }
          });
        } else {
          dates = {
            $match: {
              'clicks.date': {
                $gte: new Date(data.since),
                $lte: new Date(data.till)
              }
            }
          };
        }
      } else {
        dates = {
          $match: {
            'clicks.date': {
              $gte: new Date(data.since)
            }
          }
        };
      }
    } else if (data.till) {
      dates = {
        $match: {
          'clicks.date': {
            $lte: new Date(data.till)
          }
        }
      };
    }

    switch (data.type) {
      case 'month':
      case 'dayOfMonth':
      case 'dayOfWeek':
      case 'hour':
        query = [
          { $match: { shorturl: data.linkId } },
          { $unwind: '$clicks' },
          dates,
          {
            $project: {
              [data.type]: {
                [`$${data.type}`]: {
                  date: '$clicks.date',
                  timezone: data.timezone
                }
              }
            }
          },
          {
            $group: {
              _id: `$${data.type}`,
              count: { $count: {} }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ];
        break;
      case 'country':
      case 'region':
      case 'district':
      case 'city':
      case 'browser':
      case 'platform':
      case 'device':
        query = [
          { $match: { shorturl: data.linkId } },
          { $unwind: '$clicks' },
          dates,
          {
            $group: {
              _id: `$clicks.userdata.${data.type}`,
              count: { $count: {} }
            }
          },
          {
            $sort: { count: -1 }
          }
        ];
        break;
      case 'referrer':
        query = [
          { $match: { shorturl: data.linkId } },
          { $unwind: '$clicks' },
          dates,
          {
            $group: {
              _id: '$clicks.referrer',
              count: { $count: {} }
            }
          },
          {
            $sort: { count: -1 }
          }
        ];
        break;
      default:
        query = [
          { $match: { shorturl: data.linkId } },
          { $unwind: '$clicks' },
          dates,
          {
            $group: {
              _id: null,
              count: { $count: {} }
            }
          }
        ];
    }

    connectToDB();

    let urlData;

    const foundUrl = await ShortUrl.findOne({ shorturl: data.linkId }).select(
      'shorturl fullurl maxclicks since till linkpass date -_id'
    );
    if (!foundUrl) {
      throw new Error('Provided link not found', {
        cause: {
          status: 422,
          message: 'Provided link not found'
        }
      });
    }
    urlData = { ...foundUrl?._doc };
    if (urlData.linkpass) {
      delete urlData.linkpass;
      urlData.fullurl = 'This link is password protected';
    }

    const clickData = await ShortUrl.aggregate(query as PipelineStage[]);

    return new Response(
      JSON.stringify({
        status: 'ok',
        urlData,
        clickData: { type: data.type, stats: clickData }
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return new Response(
      JSON.stringify({
        status: 'error',
        message:
          error?.cause?.message ||
          'Something went wrong while fetching statistics'
      }),
      { status: error?.cause?.status || 500 }
    );
  }
};
