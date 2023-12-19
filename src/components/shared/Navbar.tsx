"use client";

import { Fragment } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from "../../app/assets/logo.svg";
import { useParams } from "next/navigation";
import { NewApplicationIcon, NewPoolIcon } from "./Icons";
import { useAccount, useNetwork } from "wagmi";
import Link from "next/link";

export default function Navbar() {
  const params = useParams();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const chainId = params["chainId"];

  return (
    <Disclosure
      as="nav"
      className="bg-transparent backdrop-filter bg-white bg-opacity-30 w-full z"
    >
      {({ open }: { open: boolean }) => (
        <nav>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                    src={logo}
                    alt="Allo"
                    height={32}
                    width={32}
                  />
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl py-4 px-2">
                    <span className="text-sky-400">Sea</span>
                    <span className="text-sky-600">Grants</span>
                  </h2>
                </div>
              </div>
              <div className="flex items-center">
                {isConnected && (
                  <Link
                    href={`/${chainId || chain?.id}/new`}
                    className="flex items-center mr-4"
                  >
                    <div className="mt-4 shrink-0 items-center justify-center text-white sm:h-12">
                      <NewPoolIcon />
                    </div>
                    <p className="text-sm font-medium text-gray-900 ml-2 mr-4">
                      Create a Pool
                    </p>
                  </Link>
                )}

                <div className="flex-shrink-0">
                  <ConnectButton
                    label="Connect"
                    accountStatus="address"
                    chainStatus="icon"
                    showBalance={false}
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
