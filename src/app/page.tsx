export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* NOTE:
          What do we want to show on landing page? This will depend on if the user 
          is logged in or not.
      */}
      <span className="text-4xl mt-96">Micro Grants</span>
    </main>
  );
}
