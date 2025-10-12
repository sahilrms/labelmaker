// pages/_app.js
import Head from 'next/head';
import Layout from '../components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div suppressHydrationWarning>
      <Head>
        <title>Label Maker</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

export default MyApp;