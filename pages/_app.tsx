// pages/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import 'react-phone-number-input/style.css'; // ← добавили

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
