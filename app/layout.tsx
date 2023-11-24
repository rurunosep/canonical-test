import './globals.scss';

export const metadata = {
  title: 'Canonical Test - Kevin Hernandez-Rives',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
