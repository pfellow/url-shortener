import Link from 'next/link';

import settings from '../../settings.json';
import Image from 'next/image';

import Copy from '../Copy';

const ShorteningResults = ({ shortLinkData }: any) => {
  if (!shortLinkData.shorturl) return;

  const copyHandler = async () => {
    try {
      await navigator.clipboard.writeText(
        settings.domainUrl + '/' + shortLinkData.shorturl
      );
    } catch (e) {
      console.log('Should have been copied!');
    }
  };

  return (
    <>
      <div className='flex items-center gap-4'>
        <Link
          className='sm:text-2xl text-lg accent truncate'
          href={`${settings.domainUrl}/${shortLinkData.shorturl}`}
        >{`${settings.domain}/${shortLinkData.shorturl}`}</Link>
        <Copy onClick={copyHandler} />
      </div>

      {shortLinkData.fullurl && (
        <p className='truncate'>{shortLinkData.fullurl}</p>
      )}
      {shortLinkData.maxclicks && (
        <p>
          Max Clicks: <span className='accent'>{shortLinkData.maxclicks}</span>
        </p>
      )}
      {shortLinkData.linkpass && (
        <p>
          Password: <span className='accent'>{shortLinkData.linkpass}</span>
        </p>
      )}
      {shortLinkData.since && (
        <p>
          Valid since:{' '}
          <span className='accent'>
            {new Date(shortLinkData.since).toLocaleString()}
          </span>
        </p>
      )}
      {shortLinkData.till && (
        <p>
          Valid till:{' '}
          <span className='accent'>
            {new Date(shortLinkData.till).toLocaleString()}
          </span>
        </p>
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
