import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import settings from '../settings.json';

const defaultRequest = {
  linkId: '',
  type: '',
  since: '',
  until: '',
  unique: false,
  status: ''
};

const Statistics = () => {
  const [inputLink, setInputLink] = useState('');
  const [request, setRequest] = useState(defaultRequest);
  const [statistics, setStatistics] = useState([]);
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
      if (!data) {
        // setStatistics('No data to display');
      }
      console.log(typeof data);
      setStatistics(data.data);
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
          return { ...prev, status: 'ready' };
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
    <section id='statistics' className='mx-auto max-w-[620px] p-2 w-full'>
      <div className='flex flex-col items-start w-full gap-2'>
        <p>Enter ogo link to get clicks statistics</p>
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
            required
          />
          <Select
            name='type'
            onValueChange={(value) =>
              setRequest((prev) => {
                return { ...prev, type: value };
              })
            }
          >
            <SelectTrigger className='w-[240px]'>
              <SelectValue placeholder='Statistics type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='general'>General</SelectItem>
              <SelectItem value='bymonth'>By month</SelectItem>
              <SelectItem value='byday'>By day</SelectItem>
              <SelectItem value='byhour'>By hour</SelectItem>
              <SelectItem value='countries'>Countries</SelectItem>
              <SelectItem value='regions'>Regions</SelectItem>
              <SelectItem value='districts'>Districts</SelectItem>
              <SelectItem value='cities'>Cities</SelectItem>
              <SelectItem value='browsers'>Browsers</SelectItem>
              <SelectItem value='platforms'>Platforms</SelectItem>
              <SelectItem value='devices'>Devices</SelectItem>
              <SelectItem value='referrers'>Referrers</SelectItem>
            </SelectContent>
          </Select>
          <p>Optional</p>
          <Label htmlFor='since'>Period from</Label>
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
            name='until'
            id='until'
            onChange={(event) =>
              setRequest((prev) => {
                return {
                  ...prev,
                  until: Date.parse(
                    new Date(event.target.value as string).toUTCString()
                  )
                };
              })
            }
          />

          <Label htmlFor='unique'>
            <Checkbox
              name='unique'
              value='false'
              id='unique'
              onChange={(event) =>
                setRequest((prev) => {
                  return { ...prev, unique: event.target.value };
                })
              }
            />{' '}
            Only unique clicks
          </Label>
          <Button type='submit'>Get Statistics</Button>
          {error && <p>{error}</p>}
        </form>
        {statistics &&
          statistics.map((el) => {
            console.log(statistics);
            return (
              <p className='my-1'>
                {el._id}: {el.count}
              </p>
            );
          })}
      </div>
    </section>
  );
};

export default Statistics;
