'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Link from 'next/link';

import UserDataContext from '@app/context/UserDataContext';

const ShortenedURLList = () => {
  const { prevUrls, setPrevUrls } = React.useContext(UserDataContext);

  React.useEffect(() => {
    const userData = localStorage.getItem('ogogl');
    if (!userData) return;

    const userId = JSON.parse(userData).userId;
    if (!userId) return;

    const fetchUrls = async () => {
      const response = await fetch('/api/url', {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      setPrevUrls(data.urls);
    };
    fetchUrls();
  }, []);

  return (
    <div className='mx-auto max-w-[620px] p-2 w-full'>
      <Table className='sm:text-sm text-xs'>
        <TableCaption className='caption-top'>
          List of your 10 previous shortened URLs.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[20%] whitespace-nowrap'>
              Short URL
            </TableHead>
            <TableHead className='w-[70%]'>Actual URL</TableHead>
            <TableHead className='text-right w-[10%] sm:block hidden'>
              Clicks
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prevUrls.map((url) => (
            <TableRow key={url.shorturl}>
              <TableCell className='font-medium w-[20%]'>
                <Link href={url.shorturl}>{url.shorturl}</Link>
              </TableCell>
              <TableCell className='truncate w-[70%] sm:max-w-[300px] max-w-[200px]'>
                {url.fullurl}
                {/* <Link href={url.fullurl} className='truncate w-full'>
                  {url.fullurl}
                </Link> */}
              </TableCell>
              <TableCell className='text-right w-[10%] sm:block hidden'>
                {url.clicks}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShortenedURLList;
