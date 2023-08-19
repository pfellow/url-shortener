import { connectToDB } from '@utils/database';
import BlockedDomain from '@models/blockedDomain';

export const PUT = async (request: any) => {
  const data = await request.json();
  let domainToBlock: URL;

  try {
    domainToBlock = new URL(data.url);
    connectToDB();
    const alreadyBlocked = await BlockedDomain.findOne({
      domain: domainToBlock.hostname
    });
    if (alreadyBlocked) {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'This domain is already in the list',
          blockedDomain: domainToBlock.hostname
        }),
        { status: 200 }
      );
    }
    await BlockedDomain.create({
      domain: domainToBlock.hostname,
      reason: data.reason || ''
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Error. Could not put a new blocked domain record in DB'
      }),
      { status: 500 }
    );
  }
  return new Response(
    JSON.stringify({
      status: 'ok',
      blockedDomain: domainToBlock.hostname
    }),
    { status: 201 }
  );
};
