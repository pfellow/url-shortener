'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@app/components/ui/input';
import { Button } from '@app/components/ui/button';
import { Label } from '@app/components/ui/label';

const saveUserClick = async (urlId: any) => {
  // Retrieving and saving user data

  let userData;

  try {
    const ipResponse = await fetch(
      'http://ip-api.com/json/?fields=status,country,regionName,city,district,query'
    );
    const ipData = await ipResponse.json();
    if (ipData.status === 'success') {
      userData = ipData;
    }
  } catch (error) {
    console.log(error);
  }

  try {
    fetch('/api/userclick', {
      method: 'POST',
      body: JSON.stringify({
        userData,
        urlId,
        referrer: document.referrer
      })
    });
  } catch (erorr) {}
};

const URLRedirect = ({ params }: any) => {
  const [displayData, setDisplayData] = useState('Loading...' as any);
  const router = useRouter();

  useEffect(() => {
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

          const passwordCheckHandler = async (event: any) => {
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
                if (passData.status === 'ok' && passData.url.fullurl) {
                  saveUserClick(data.url.id);
                  return setDisplayData(`Successful redirection!`); // DELETE

                  // router.push(passData.url.fullurl);
                }
                if (passData.status === 'error') {
                  throw new Error(passData?.message);
                }
                throw new Error();
              } catch (error: any) {
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
                  value={enteredPass}
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

      if (data.status === 'ok' && data.url) {
        saveUserClick(data.url.id);

        return setDisplayData(`Successful redirection!`); // DELETE

        // router.push(data.url.fullurl);
      }
    };

    getRedirectUrl();
  }, []);

  return <div>{displayData}</div>;
};

export default URLRedirect;
