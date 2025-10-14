import { useRouter } from 'next/router';
export default function Dashboard() {
  const router = useRouter();

  const handleCreateLabel = () => {
    router.push('/label-maker');
  };
  return (
    <div className="bg-white rounded-lg shadow p-6" >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Welcome to Label Maker</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={handleCreateLabel}>
          Create Label
        </button>
      </div>
      <p className="mt-2 text-gray-600">Select an option from the sidebar to get started.</p>
    </div>
  );
}