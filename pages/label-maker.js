// pages/label-maker.js
import dynamic from 'next/dynamic';

// Disable SSR for the form to prevent hydration issues
const LabelForm = dynamic(() => import('../components/LabelForm'), {
  ssr: false,
});

export default function LabelMaker() {
  return (
    <div className="container mx-auto p-4 print-section">
      <h1 className="text-2xl font-bold mb-6 text-center no-print">Label Maker</h1>
      <LabelForm />
    </div>
  );
}