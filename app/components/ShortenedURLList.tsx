'use client';

import React from 'react';
import { nanoid } from 'nanoid';
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

const ShortenedURLList = () => {
  const [urls, setUrls] = React.useState([]);

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
      setUrls(data.urls);
    };
    fetchUrls();
  }, []);

  return (
    <div className='mx-auto max-w-[620px] p-6 w-full'>
      <Table>
        <TableCaption>A list of your previous shortened URLs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Short Link</TableHead>
            <TableHead>Actual Link</TableHead>
            <TableHead className='text-right'>Clicks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urls.map((url) => (
            <TableRow>
              <TableCell className='font-medium'>
                <Link href={url.shorturl}>{url.shorturl}</Link>
              </TableCell>
              <TableCell>
                <Link
                  href={url.fullurl}
                  className='mt-0 whitespace-nowrap overflow-hidden'
                >
                  {url.fullurl.length > 40
                    ? url.fullurl.substring(0, 40) + '...'
                    : url.fullurl}
                </Link>
              </TableCell>
              <TableCell className='text-right'>{url.clicks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShortenedURLList;
