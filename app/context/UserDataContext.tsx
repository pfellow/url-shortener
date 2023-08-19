'use client';

import { createContext } from 'react';

const UserDataContext = createContext({
  prevUrls: [],
  setPrevUrls: (urls: any) => {},
  userData: { guestId: '', token: '' },
  theme: '',
  setTheme: (() => {}) as any
});

export default UserDataContext;
