import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'oGo URL shortener',
  description: 'oGo free URL shortener ogo.gl'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <html lang='en'>{children}</html>;
}
