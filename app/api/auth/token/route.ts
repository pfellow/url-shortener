import jwt from 'jsonwebtoken';

import { nanoid } from 'nanoid/non-secure';

export const POST = async (request: any) => {
  let { guestId } = await request.json();

  try {
    if (!guestId) {
      guestId = nanoid(16);
    } else if (!/^([A-Za-z0-9_-]{16})$/.test(guestId)) {
      throw new Error('Incorrect guestId!');
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: 'Incorrect guestId!'
      }),
      {
        status: 422
      }
    );
  }

  const token = jwt.sign(
    {
      guestId
    },
    process.env.JWT_SECRET_KEY_SIMPLE,
    { expiresIn: '3h' }
  );
  return new Response(
    JSON.stringify({
      guestId,
      token
    }),
    {
      status: 200
    }
  );
};
