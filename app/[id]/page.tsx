'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const URLRedirect = ({ params }) => {
  const [displayData, setDisplayData] = useState('Loading...');
  const router = useRouter();

  React.useEffect(() => {
    const getRedirectUrl = async () => {
      const response = await fetch(`/api/url/${params.id}`);
      const data = await response.json();

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
      if (data.url.linkpass) {
        return setDisplayData(
          `This link is password protected: ${data.url.linkpass}`
        );
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
            urlId: data.url._id,
            referrer: document.referrer
          })
        });
      } catch (erorr) {}

      // setTimeout(() => {
      //   router.push(data.url.fullurl);
      // }, 10000);
    };

    getRedirectUrl();
  }, []);

  return <div>{displayData}</div>;
};

export default URLRedirect;
