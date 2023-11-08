"use client";

import Link from "next/link";

export default async function Navbar() {
  return (
    <nav className="flex flex-row items-center justify-between p-2">
      <div className="flex">
        <Link href="/">Micro Grants</Link>
      </div>
      <div className="flex p-1 rounded-md hover:bg-white hover:text-black">
        <Link href="/applications">Applications</Link>
      </div>
      <div className="flex">
        <button
          className="py-1 px-2 bg-gray-600 text-white rounded-md hover:bg-gray-200 hover:text-black"
          onClick={() => {
            console.log("TODO: Connect wallet");
          }}
        >
          Connect
        </button>
      </div>
    </nav>
  );
}
