import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import '../styles/globals.css';

const publicPages = ['/auth/signin', '/auth/register'];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isPublicPage = publicPages.includes(router.pathname);
  const { session, ...restPageProps } = pageProps;

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Label Maker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
         <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </Head>
      {isPublicPage ? (
        <Component {...restPageProps} />
      ) : (
        <Layout>
          <Component {...restPageProps} />
        </Layout>
      )}
    </SessionProvider>
  );
}

export default MyApp;