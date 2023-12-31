'use client';

import { useContext, useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@app/components/ui/table';
import Link from 'next/link';

import UserDataContext from '@app/context/UserDataContext';
import settings from '../settings.json';
import Loader from './Loader';
import { Separator } from '@app/components/ui/separator';

const ShortenedURLList = () => {
  const { prevUrls, setPrevUrls } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('ogogl');
    if (!userData) return;

    const guestId = JSON.parse(userData).guestId;
    if (!guestId) return;

    const fetchUrls = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/url', {
          method: 'POST',
          body: JSON.stringify({ guestId })
        });
        const data = await response.json();
        setPrevUrls(data.urls);
      } catch (error) {
        console.log('Could not fetch user urls');
      }
      setIsLoading(false);
    };
    fetchUrls();
  }, []);

  return (
    <section className='mx-auto max-w-[700px] p-2 w-full' id='previous'>
      {isLoading && <Loader />}
      {prevUrls?.length > 0 ? (
        <Table className='sm:text-sm text-xs'>
          <TableCaption className='caption-top text-lg text-primary'>
            Your 10 previous shortened URLs
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
            {prevUrls.map((url: any) => (
              <TableRow key={url.shorturl}>
                <TableCell className='font-medium w-[20%]'>
                  <Link
                    href={`${settings.domainUrl}/${url.shorturl}`}
                  >{`${settings.domain}/${url.shorturl}`}</Link>
                </TableCell>
                <TableCell className='truncate w-[70%] sm:max-w-[300px] max-w-[200px]'>
                  {url.fullurl}
                </TableCell>
                <TableCell className='text-right w-[10%] sm:block hidden'>
                  {url.clicks}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className='text-lg text-primary'>No previous URLs found</p>
      )}
      <Separator />
    </section>
  );
};

export default ShortenedURLList;
