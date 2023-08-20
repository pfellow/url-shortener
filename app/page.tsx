'use client';

import { useState, useEffect } from 'react';
import { Oxygen } from 'next/font/google';
const heebo = Oxygen({ weight: '400', subsets: ['latin'] });
import Footer from './components/Footer';
import MainForm from './components/MainForm/MainForm';
import Nav from './components/Nav';
import ShortenedURLList from './components/ShortenedURLList';
import UserDataContext from './context/UserDataContext';
import Statistics from './components/Statistics/Statistics';
import Terms from './components/Terms';
import Contact from './components/Contact';
import Loader from './components/Loader';

export default function Home() {
  const [prevUrls, setPrevUrls] = useState([]);
  const [userData, setUserData] = useState({
    guestId: '',
    token: '',
    theme: ''
  });
  const [theme, setTheme] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const userDataLocal = localStorage.getItem('ogogl') || '{}';
    const userTheme = localStorage.getItem('ogogl-theme') || 'light';
    const userDataId = JSON.parse(userDataLocal)?.guestId;
    const userToken = JSON.parse(userDataLocal)?.token;
    const userTokenExp = JSON.parse(userDataLocal)?.tokenexp || 0;
    setTheme(userTheme);

    const getUserData = async () => {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        body: JSON.stringify({
          guestId: userDataId
        })
      });
      const newUserData = await response.json();

      setUserData({
        guestId: newUserData.guestId,
        token: newUserData.token,
        theme
      });
      return localStorage.setItem(
        'ogogl',
        JSON.stringify({
          guestId: newUserData.guestId,
          token: newUserData.token,
          tokenexp: Date.now() + 3 * 60 * 60000
        })
      );
    };

    if (!userDataId || !userToken || userTokenExp < Date.now()) {
      getUserData();
    }
    setUserData({ guestId: userDataId, token: userToken, theme });
    setLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('ogogl-theme', theme);
  }, [theme]);

  return (
    <UserDataContext.Provider
      value={{ prevUrls, setPrevUrls, userData, theme, setTheme }}
    >
      {' '}
      {!loaded && (
        <body className='flex justify-center items-center h-screen'>
          <Loader />
        </body>
      )}
      {loaded && (
        <body className={`${heebo.className} ${theme} body`}>
          <Nav />
          <main className='flex flex-col justify-center items-center max-w-[1000px] mx-auto lg:rounded-lg'>
            <MainForm />
            <ShortenedURLList />
            <Statistics />
            <Terms />
            <Contact />
          </main>
          <Footer />
        </body>
      )}
    </UserDataContext.Provider>
  );
}
