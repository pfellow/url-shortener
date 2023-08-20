import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@app/components/ui/select';

import settings from '../../settings.json';
import ShorteningResults from '../MainForm/ShorteningResults';
import ClickStatistics from './ClickStatistics';

const defaultRequest = {
  linkId: '',
  type: undefined as undefined | string,
  since: undefined as undefined | number,
  till: undefined as undefined | number,
  timezone: '',
  status: ''
};

const Statistics = () => {
  const [inputLink, setInputLink] = useState();
  const [request, setRequest] = useState(defaultRequest);
  const [statistics, setStatistics] = useState({} as any);
  const [error, setError] = useState('');

  const getStatistics = async () => {
    try {
      const response = await fetch(`/api/url/statistics/`, {
        method: 'POST',
        body: JSON.stringify({ ...request }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      console.log(data);
      setStatistics(data);
    } catch (error) {
      setError('Something went wrong. Please try again later');
    }
  };

  const submitHandler = (event: any) => {
    event.preventDefault();
    if (inputLink) {
      try {
        const urlArray = inputLink.split('/');
        const linkId = urlArray[urlArray.length - 1];
        if (
          urlArray[urlArray.length - 2] !== settings.domain ||
          !/^([a-zA-z0-9]{3,12})$/.test(linkId)
        ) {
          setError('No correct oGo link provided');
        } else {
          setRequest((prev) => {
            return { ...prev, linkId };
          });
        }
        if (!request.type) {
          setRequest((prev) => {
            return { ...prev, type: 'general' };
          });
        }
        setRequest((prev) => {
          return {
            ...prev,
            timezone: moment().format('Z'),
            status: 'ready'
          };
        });
      } catch (error) {
        console.log('Something went wrong... Possibly incorrect user input');
      }
    }
  };

  useEffect(() => {
    if (request.status !== 'ready') return;
    setRequest((prev) => {
      return { ...prev, status: '' };
    });
    getStatistics();
  }, [request.status]);

  return (
    <section id='clicks' className='mx-auto max-w-[700px] p-2 w-full mt-4'>
      <div className='flex flex-col items-start w-full gap-2'>
        <p className='text-lg text-accent'>
          Enter ogo link to get clicks statistics
        </p>
        <form
          onSubmit={submitHandler}
          className='flex flex-col items-start gap-2'
        >
          <Label htmlFor='pass'>oGo Link</Label>
          <Input
            id='pass'
            type='text'
            onChange={(event) => setInputLink(event.target.value)}
            value={inputLink}
            placeholder={`${settings.domain}/abcdef`}
            required
          />
          <Select
            name='type'
            onValueChange={(value) =>
              setRequest((prev) => {
                return { ...prev, type: value };
              })
            }
            value={request.type}
          >
            <SelectTrigger className='w-[240px]'>
              <SelectValue placeholder='Statistics type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='general'>General</SelectItem>
              <SelectItem value='month'>By month</SelectItem>
              <SelectItem value='dayOfMonth'>By day of month</SelectItem>
              <SelectItem value='dayOfWeek'>By day of week</SelectItem>
              <SelectItem value='hour'>By hour</SelectItem>
              <SelectItem value='country'>Countries</SelectItem>
              <SelectItem value='region'>Regions</SelectItem>
              <SelectItem value='district'>Districts</SelectItem>
              <SelectItem value='city'>Cities</SelectItem>
              <SelectItem value='browser'>Browsers</SelectItem>
              <SelectItem value='platform'>Platforms</SelectItem>
              <SelectItem value='device'>Devices</SelectItem>
              <SelectItem value='referrer'>Referrers</SelectItem>
            </SelectContent>
          </Select>
          <p>Optional</p>
          <Label htmlFor='since'>Period from</Label>{' '}
          //https://github.com/arqex/react-datetime
          <Input
            type='datetime-local'
            name='since'
            id='since'
            onChange={(event) =>
              setRequest((prev) => {
                return {
                  ...prev,
                  since: Date.parse(
                    new Date(event.target.value as string).toUTCString()
                  )
                };
              })
            }
          />
          <Label htmlFor='until'>Period until</Label>
          <Input
            type='datetime-local'
            name='till'
            id='till'
            onChange={(event) =>
              setRequest((prev) => {
                return {
                  ...prev,
                  till: Date.parse(
                    new Date(event.target.value as string).toUTCString()
                  )
                };
              })
            }
          />
          <Button type='submit'>Get Statistics</Button>
          {error && <p>{error}</p>}
        </form>
        {statistics?.urlData && statistics?.clickData?.type === 'general' && (
          <ShorteningResults shortLinkData={statistics.urlData} />
        )}
        <ClickStatistics stats={statistics} />
      </div>
    </section>
  );
};

export default Statistics;
