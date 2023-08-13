'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';

const saveUserClick = async (urlId) => {
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
        userIp,
        urlId,
        referrer: document.referrer
      })
    });
  } catch (erorr) {}
};

const URLRedirect = ({ params }) => {
  const [displayData, setDisplayData] = useState('Loading...');
  const router = useRouter();

  React.useEffect(() => {
    const getRedirectUrl = async () => {
      // retrieving the url data ans status

      let data: any;

      try {
        const response = await fetch(`/api/url/${params.id}`);
        data = await response.json();

        if (!data) {
          setDisplayData('Something went wrong. Please try again later');
        }
      } catch (error) {
        console.log(error);
        return setDisplayData('Something went wrong. Please try again later');
      }

      if (data.status === 'error') {
        setDisplayData(
          data.message || 'Something went wrong. Please try again later'
        );
      }

      if (data.status === 'protected') {
        const Form = () => {
          const [enteredPass, setEnteredPass] = useState('');
          const [incorrectPassword, setIncorrectPassword] = useState('');

          const passwordCheckHandler = async (event) => {
            event.preventDefault();
            if (enteredPass) {
              try {
                const response = await fetch('/api/url/checkpass', {
                  method: 'POST',
                  body: JSON.stringify({
                    id: data.url.id,
                    userPass: enteredPass
                  })
                });

                const passData = await response.json();
                if (passData.status === 'OK' && passData.url.fullurl) {
                  saveUserClick(data.url.id);
                  return setDisplayData(`Success redirection!`); // DELETE

                  // return setTimeout(() => {
                  //   router.push(passData.url.fullurl);
                  // }, 3000);
                }
                if (passData.status === 'error') {
                  throw new Error(passData?.message);
                }
                throw new Error();
              } catch (error) {
                setIncorrectPassword(
                  error.message || 'Something went wrong...'
                );
              }
            }
          };

          return (
            <div className='grid w-full max-w-sm items-center gap-1.5'>
              <p>{`This link is password protected.`}</p>
              <form onSubmit={passwordCheckHandler}>
                <Label htmlFor='pass'>Please enter password</Label>
                <Input
                  id='pass'
                  type='text'
                  onChange={(event) => setEnteredPass(event.target.value)}
                />
                <Button type='submit'>Verify</Button>
                {incorrectPassword}
              </form>
            </div>
          );
        };

        setDisplayData(<Form />);
        return;
      }

      if (data.status === 'OK' && data.url) {
        saveUserClick(data.url.id);

        return setDisplayData(`Success redirection!`); // DELETE

        // return setTimeout(() => {
        //   router.push(data.url.fullurl);
        // }, 3000);
      }
    };

    getRedirectUrl();
  }, []);

  return <div>{displayData}</div>;
};

export default URLRedirect;
