'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const URLRedirect = ({ params }) => {
  const router = useRouter();

  React.useEffect(() => {
    const getRedirectUrl = async () => {
      const response = await fetch(`/api/url/${params.id}`);
      const data = await response.json();

      console.log(data);

      router.push(data.url.fullurl);
    };
    getRedirectUrl();
  }, []);

  return <div>Loading...</div>;
};

export default URLRedirect;
