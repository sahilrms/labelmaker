import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import { AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { SalesProvider } from '../contexts/SalesContext';
import ToastProvider from '../components/ui/ToastProvider';
import '../styles/globals.css';

const publicPages = ['/auth/signin', '/auth/register'];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isPublicPage = publicPages.includes(router.pathname);
  const { session, ...restPageProps } = pageProps;

  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <ToastProvider>
          <Head>
            <title>Label Maker</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          </Head>
          <SalesProvider>
            <AnimatePresence mode="wait" initial={false}>
              {isPublicPage ? (
                <Component key={router.pathname} {...restPageProps} />
              ) : (
                <Layout>
                  <Component key={router.pathname} {...restPageProps} />
                </Layout>
              )}
            </AnimatePresence>
          </SalesProvider>
        </ToastProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}

export default MyApp;