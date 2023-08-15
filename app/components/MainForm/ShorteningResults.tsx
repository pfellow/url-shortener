import { useEffect, useState } from 'react';
import Link from 'next/link';

import settings from '../../settings.json';
import Image from 'next/image';

const ShorteningResults = ({ shortLinkData }: any) => {
  if (!shortLinkData.shorturl) return;

  return (
    <>
      <p className='text-lg'>
        <Link
          href={`${settings.domainUrl}/${shortLinkData.shorturl}`}
        >{`${settings.domain}/${shortLinkData.shorturl}`}</Link>
      </p>
      {shortLinkData.fullurl && (
        <p className='truncate'>{shortLinkData.fullurl}</p>
      )}
      {shortLinkData.maxclicks && <p>Max Clicks: {shortLinkData.maxclicks}</p>}
      {shortLinkData.linkpass && <p>Password: {shortLinkData.linkpass}</p>}
      {shortLinkData.since && (
        <p>Valid since: {new Date(shortLinkData.since).toLocaleString()}</p>
      )}
      {shortLinkData.till && (
        <p>Valid till: {new Date(shortLinkData.till).toLocaleString()}</p>
      )}
      <Image
        src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${settings.domainUrl}/${shortLinkData.shorturl}`}
        width={200}
        height={200}
        alt='QR code'
      />
    </>
  );
};

export default ShorteningResults;
