export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <div className="text-3xl font-bold mt-4">Loading Pools...</div>
      </div>
    </div>
  );
}
