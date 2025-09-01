import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI-Powered 3D Dynamic Portfolio',
  description: 'A cutting-edge 3D dynamic portfolio website that functions as an intelligent project manager, automatically showcasing GitHub repositories with AI-driven insights and analytics.',
  keywords: 'portfolio, 3D, AI, GitHub, projects, developer, software engineer',
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    title: 'AI-Powered 3D Dynamic Portfolio',
    description: 'A cutting-edge 3D dynamic portfolio website with AI-driven insights',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered 3D Dynamic Portfolio',
    description: 'A cutting-edge 3D dynamic portfolio website with AI-driven insights',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
