'use client';

import { createContext } from 'react';

const UserDataContext = createContext({
  prevUrls: [],
  setPrevUrls: (urls) => {}
});

export default UserDataContext;
