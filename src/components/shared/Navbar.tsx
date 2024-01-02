"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useParams } from "next/navigation";
import { NewApplicationIcon, NewPoolIcon } from "./Icons";
import { useAccount, useNetwork } from "wagmi";
import Link from "next/link";

export default function Navbar() {
  const { chainId } = useParams<{chainId: string}>();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  return (
    <Disclosure
      as="nav"
      className="bg-transparent backdrop-filter bg-white bg-opacity-30 w-full z"
    >
      {({ open }: { open: boolean }) => (
        <nav>
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div
                  className="flex flex-shrink-0 items-center cursor-pointer"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  <Image
                    className="h-10 w-auto"
                    src="/assets/logo.svg"
                    alt="Allo"
                    height={32}
                    width={32}
                  />
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl py-4 px-2">
                    <span className="text-sky-900">Impact Hub</span>
                  </h2>
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  href={`#`}
                  className="flex items-center mr-4"
                >
                  <p className="text-sm font-medium text-gray-900 ml-2 mr-4">
                    Feed
                  </p>
                </Link>
                <Link
                  href={`#`}
                  className="flex items-center mr-4"
                >
                  <p className="text-sm font-medium text-gray-900 ml-2 mr-4">
                    Explore
                  </p>
                </Link>
                <Link
                  href={`#`}
                  className="flex items-center mr-4"
                >
                  <p className="text-sm font-medium text-gray-900 ml-2 mr-4">
                    Initiative
                  </p>
                </Link>
                <Link
                  href={`#`}
                  className="flex items-center mr-4"
                >
                  <p className="text-sm font-medium text-gray-900 ml-2 mr-4">
                    Community
                  </p>
                </Link>
              </div>
              <div className="flex items-center">
                {isConnected && (
                  <Link
                    href={`/${chainId || chain?.id}/new`}
                    className="flex items-center mr-4"
                  >
                    <p className="text-sm font-medium text-gray-900 ml-2 mr-4">
                      Create a Pool
                    </p>
                  </Link>
                )}

                <div className="flex-shrink-0">
                  <ConnectButton
                    label="Connect"
                    accountStatus={{
                      smallScreen: 'avatar',
                      largeScreen: 'full',
                    }}
                    chainStatus="icon"
                    showBalance={{
                      smallScreen: false,
                      largeScreen: true,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
    </Disclosure>
  );
}
