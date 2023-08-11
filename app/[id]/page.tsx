'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import bcrypt from 'bcryptjs-react';

const URLRedirect = ({ params }) => {
  const [displayData, setDisplayData] = useState('Loading...');
  const router = useRouter();

  React.useEffect(() => {
    const getRedirectUrl = async () => {
      // retrieving the url data
      let data;

      try {
        const response = await fetch(`/api/url/${params.id}`);
        data = await response.json();
        if (data === null || data.error) {
          throw new Error('This link is not valid!');
        }
      } catch (error) {
        console.log(error);
        return setDisplayData('This link is not valid.');
      }

      // checking for the custom fields

      if (data.url.since && data.url.since > Date.now()) {
        return setDisplayData('This link is not available yet');
      }
      if (data.url.till && data.url.till < Date.now()) {
        return setDisplayData(
          `This link was available before ${new Date(
            data.url.till
          ).toUTCString()}`
        );
      }
      if (data.url.hash) {
        const Form = () => {
          const [enteredPass, setEnteredPass] = useState('');
          const [incorrectPassword, setIncorrectPassword] = useState();
          const passwordCheckHandler = (event) => {
            event.preventDefault();
            if (enteredPass) {
              if (bcrypt.compareSync(enteredPass, data.url.hash)) {
                return setDisplayData(`Success!`);
              }
              setIncorrectPassword(true);
            }
          };

          return (
            <div className='grid w-full max-w-sm items-center gap-1.5'>
              <p>{`This link is password protected.`}</p>
              <form onSubmit={passwordCheckHandler} autoComplete='off'>
                <Label htmlFor='pass'>Please enter password</Label>
                <Input
                  id='pass'
                  type='text'
                  onChange={(event) => setEnteredPass(event.target.value)}
                  value={enteredPass}
                  autoComplete='off'
                />
                <Button type='submit'>Verify</Button>
                {incorrectPassword && <p>Incorrect password</p>}
              </form>
            </div>
          );
        };

        return setDisplayData(<Form />);
      }
      if (data.url.maxclicks && 3 >= data.url.maxclicks) {
        // IMPLEMENT LOGIC
        return setDisplayData(
          'This link is no longer avaliable. The number of clicks is exceeded.'
        );
      }
      // Retrieving and saving user data

      let userIp;

      try {
        const ipResponse = await fetch(
          'https://api.bigdatacloud.net/data/client-ip'
        );
        const ipData = await ipResponse.json();
        userIp = ipData.ipString;
      } catch (error) {
        console.log(error);
      }

      try {
        fetch('/api/userclick', {
          method: 'POST',
          body: JSON.stringify({
            userIp: userIp,
            urlId: data.url.id,
            referrer: document.referrer
          })
        });
      } catch (erorr) {}

      return setDisplayData(`Success!`);

      // setTimeout(() => {
      //   router.push(data.url.fullurl);
      // }, 10000);
    };

    getRedirectUrl();
  }, []);

  return <div>{displayData}</div>;
};

export default URLRedirect;
