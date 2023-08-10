import Footer from './components/Footer';
import MainForm from './components/MainForm';
import Nav from './components/Nav';
import ShortenedURLList from './components/ShortenedURLList';

export default function Home() {
  return (
    <>
      <Nav />
      <main className='flex flex-col justify-center items-center w-full'>
        <MainForm />
        <ShortenedURLList />
      </main>
      <Footer />
    </>
  );
}
