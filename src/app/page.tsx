import PoolList from "@/components/pool/PoolList";

export default function Home() {
  return (
    <main>
      {/* NOTE:
          What do we want to show on landing page? This will depend on if the user 
          is logged in or not.
      */}
      <div className="mx-auto max-w-2xl py-32 sm:py-48">
        <img
          src=" https://tailwindui.com/img/beams-basic.png"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            !MicroGrants
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Micro-grant programs, common in web3 communities like Gitcoin, Celo,
            and ENS to engage members and empower project contributions aligned
            with their mission, often present challenges in accessibility.
          </p>
        </div>
      </div>
      <PoolList />
    </main>
  );
}
