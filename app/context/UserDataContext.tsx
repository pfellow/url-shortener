'use client';

import { createContext } from 'react';

const UserDataContext = createContext({
  prevUrls: [],
  setPrevUrls: (urls: any) => {},
  userData: { guestId: '', token: '' }
});

export default UserDataContext;
