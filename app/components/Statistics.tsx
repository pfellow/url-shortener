import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import settings from '../settings.json';

const Statistics = () => {
  const [request, setRequest] = useState({
    link: '',
    type: '',
    since: '',
    untill: '',
    unique: false
  });
  const [statistics, setStatistics] = useState('');
  const [error, setError] = useState('');

  const getStatistics = async () => {
    try {
      const response = await fetch(`/api/url/statistics/`, {
        method: 'POST',
        body: JSON.stringify({ request }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (!data) {
        setStatistics('No data to display');
      }
      setStatistics(data);
    } catch (error) {
      setError('Something went wrong. Please try again later');
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (request.link) {
      const url = request.link.split('/');
      console.log(url);
      try {
        if (
          url[length - 2] === settings.domain &&
          /^([a-zA-z0-9]{3,12})$/.test(url[length - 1])
        ) {
          console.log('GOOD!'); // CONTINUE HERE
        }
        console.log('BAD!');
      } catch (error) {
        console.log('ERROR');
      }
    }
    // getStatistics(); UNCOMMENT
  };

  return (
    <section id='statistics'>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <p>Enter ogo link to get clicks statistics</p>
        <form onSubmit={submitHandler}>
          <Label htmlFor='pass'>oGo Link</Label>
          <Input
            id='pass'
            type='text'
            onChange={(event) =>
              setRequest((prev) => {
                return { ...prev, link: event.target.value };
              })
            }
            value={request.link}
            required
          />
          <Select required name='type'>
            <SelectTrigger className='w-[180px]'>
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
          <Input type='datetime-local' name='since' />
          <Input type='datetime-local' name='until' />
          <Checkbox name='unique' value={false} id='unique' />
          <Label htmlFor='unique'>Show only unique clicks</Label>
          <Button type='submit'>Get Statistics</Button>
          {error}
        </form>
        {statistics}
      </div>
    </section>
  );
};

export default Statistics;
