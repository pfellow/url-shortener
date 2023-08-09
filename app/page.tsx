import MainForm from './components/MainForm';
import ShortenedURLList from './components/ShortenedURLList';

export default function Home() {
  return (
    <main className='flex flex-col justify-center items-center'>
      <MainForm />
      <ShortenedURLList />
    </main>
  );
}
