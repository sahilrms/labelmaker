// pages/counters/index.js
'use client';

import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { CountersProvider } from '../../contexts/CountersContext';

// Dynamically import the client-side only component
const CountersClient = dynamic(
  () => import('../../components/counters/CountersClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export default function CountersPage() {
  return (
    <CountersProvider>
      {/* <Layout> */}
        <CountersClient />
      {/* </Layout> */}
    </CountersProvider>
  );
}