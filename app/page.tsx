'use client';

import { useState } from 'react';
import Footer from './components/Footer';
import MainForm from './components/MainForm';
import Nav from './components/Nav';
import ShortenedURLList from './components/ShortenedURLList';
import UserDataContext from './context/UserDataContext';

export default function Home() {
  const [prevUrls, setPrevUrls] = useState([]);
  return (
    <>
      <Nav />
      <main className='flex flex-col justify-center items-center w-full'>
        <UserDataContext.Provider value={{ prevUrls, setPrevUrls }}>
          <MainForm />
          <ShortenedURLList />
        </UserDataContext.Provider>
      </main>
      <Footer />
    </>
  );
}
