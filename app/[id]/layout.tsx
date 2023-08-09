import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ogo URL shortener',
  description: 'URL shortener ogo.gl'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
