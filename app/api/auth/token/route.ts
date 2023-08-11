import jwt from 'jsonwebtoken';

import { nanoid } from 'nanoid/non-secure';

export const POST = async (request: any) => {
  let { userId } = await request.json();

  try {
    if (!userId) {
      userId = nanoid(16);
    } else if (!/^([A-Za-z0-9_-]{16})$/.test(userId)) {
      throw new Error('Incorrect userId!');
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: 'userId'
      }),
      {
        status: 422
      }
    );
  }

  const token = jwt.sign(
    {
      userId
    },
    process.env.JWT_SECRET_KEY_SIMPLE,
    { expiresIn: '3h' }
  );
  return new Response(
    JSON.stringify({
      userId,
      token
    }),
    {
      status: 200
    }
  );
};
