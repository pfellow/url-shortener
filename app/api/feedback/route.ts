import { connectToDB } from '@utils/database';
import { customAlphabet } from 'nanoid/non-secure';
import jwt from 'jsonwebtoken';
import Feedback from '@models/feedback';

export const PUT = async (request: any) => {
  const data = await request.json();

  const sanitizedData: any = {};

  // Checking guestId

  if (!data.guestId || !data.token) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Authorization failed. Please reload the page.'
      }),
      {
        status: 401
      }
    );
  }

  let decodedToken: any = {};
  try {
    decodedToken = jwt.verify(
      data.token,
      process.env.JWT_SECRET_KEY_SIMPLE as string
    );
    if (!decodedToken || decodedToken.guestId !== data.guestId) {
      throw new Error(
        'Authorization failed. Clear the cache and reload the page.'
      );
    } else {
      if (decodedToken.exp * 1000 >= Date.now()) {
        sanitizedData.guestId = decodedToken.guestId;
      } else {
        throw new Error('Token expired. Please reload the page.');
      }
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message
      }),
      {
        status: 401
      }
    );
  }

  // checking form data
  try {
    if (data.data.name) {
      if (data.data.name.length >= 2 && data.data.name.length <= 30) {
        sanitizedData.name = data.data.name;
      } else {
        throw new Error('Name shoud be 2-30 characters long');
      }
    }
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        data.data.email
      )
    ) {
      sanitizedData.email = data.data.email;
    } else {
      throw new Error('Email');
    }
    if (data.data.ogolink) {
      const ogolinkArray = data.data.ogolink.split('/');
      const ogolink = ogolinkArray[ogolinkArray.length - 1];
      if (/^([a-zA-z0-9-]{3,12})$/.test(ogolink)) {
        sanitizedData.ogolink = ogolink;
      } else {
        throw new Error('ogolink');
      }
    }
    if (
      [
        'bug',
        'suggestion',
        'collaboration',
        'complaint',
        'feedback',
        'other'
      ].includes(data.data.type)
    ) {
      sanitizedData.reqtype = data.data.type;
    } else {
      throw new Error('Request type');
    }
    if (data.data.message.length >= 5 && data.data.message.length <= 3000) {
      sanitizedData.message = data.data.message;
    } else {
      throw new Error('Message chould be 5-3000 characters long');
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Incorrect data provided: ' + error.message
      }),
      {
        status: 400
      }
    );
  }
  sanitizedData.ticket = customAlphabet('1234567890ABCDEF', 6)();

  // Saving message to DB

  try {
    connectToDB();
    await Feedback.create(sanitizedData);
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message:
          'Could not save the message. Please try again later' + error.message
      }),
      {
        status: 500
      }
    );
  }

  return new Response(
    JSON.stringify({
      status: 'ok',
      ticket: sanitizedData.ticket
    }),
    {
      status: 201
    }
  );
};
