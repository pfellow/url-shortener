import { Separator } from '@app/components/ui/separator';
import moment from 'moment';

const ClickStatistics = ({ stats }: any) => {
  if (stats.status === 'error')
    return (
      <>
        <p>{stats.message || 'Something went wrong. Please try again later'}</p>
        <Separator />
      </>
    );
  if (!stats.clickData)
    return (
      <>
        <p className='text-lg text-accent py-2'>
          Statistics will be displayed here
        </p>
        <Separator />
      </>
    );
  const data = stats.clickData;
  let dataToDisplay = {
    clicks: 0,
    stats: [] as { _id: string; count: string }[]
  };
  if (data?.stats.length === 1) {
    dataToDisplay.clicks = data.stats[0].count;
  }
  if (data?.type === 'month') {
    dataToDisplay.stats = data.stats.map((el: any) => {
      return {
        _id: moment(el._id, 'MM').format('MMMM'),
        count: el.count
      };
    });
  } else if (data?.type === 'dayOfWeek') {
    dataToDisplay.stats = data.stats.map((el: any) => {
      return {
        _id: moment(el._id - 1, 'd').format('dddd'),
        count: el.count
      };
    });
  } else {
    dataToDisplay.stats = data.stats;
  }
  return (
    <>
      {data?.type !== 'general' && +dataToDisplay.stats.length === 1 && (
        <p>
          {dataToDisplay.stats[0]._id || 'No details'}: {dataToDisplay.clicks}
        </p>
      )}
      {dataToDisplay.stats.length > 1 &&
        dataToDisplay.stats.map((el: any) => {
          dataToDisplay.clicks += el.count;
          return (
            <p key={el._id}>
              {el._id || 'Unknown'}: {el.count}
            </p>
          );
        })}
      <p className='text-lg'>
        Total clicks:{' '}
        <span className='text-accent font-bold'>{dataToDisplay.clicks}</span>
      </p>
      <Separator />
    </>
  );
};

export default ClickStatistics;
