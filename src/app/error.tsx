"use client"; // Error components must be Client Components

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm mx-auto">
        <h2 className="text-xl font-semibold text-red-800">
          Something went wrong!
        </h2>
        <p className="text-red-700">
          {error.message}
          {error.digest && (
            <span>
              {" "}
              <small>({error.digest})</small>
            </span>
          )}
        </p>
        <div className="flex flex-row justify-between items-center">
          <button
            onClick={() => reset()}
            className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 focus:outline-none"
          >
            Try again
          </button>
          <button
            onClick={() => {
              router.push("/");
            }}
            className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 focus:outline-none"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
