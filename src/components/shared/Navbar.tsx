"use client";

import { Fragment } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Disclosure, Menu, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import logo from "../../app/assets/logo.svg";
import { classNames } from "@/utils/common";
import { useParams } from "next/navigation";
// import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { NewApplicationIcon, NewPoolIcon } from "./Icons";

export default function Navbar() {
  const params = useParams();

  const chainId = params["chainId"];
  const poolId = params["poolId"];

  const navigation = [{ name: "Pools", href: "/pool", current: false }];

  const userNavigation = [
    {
      name: "My Profile",
      href: "/profile/0xbyu2f3buf4g5buiuivb3f4g5vbyuiof45gbyui",
    },
    // api endpoint calling logout function and redirect to /
    { name: "Sign out", href: "/log-out" },
  ];

  const creations = [
    {
      name: "New Application",
      description: "Register / Update your application",
      href: `/${chainId}/${poolId}/new`,
      icon: NewApplicationIcon,
      show: chainId && poolId,
    },
    {
      name: "New Pool",
      description: "Create your own pool",
      href: `/pool/new`,
      icon: NewPoolIcon,
      show: true,
    },
  ];

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
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center cursor-pointer">
                  <Image
                    className="h-8 w-auto"
                    src={logo}
                    alt="Allo"
                    height={32}
                    width={32}
                    onClick={() => {
                      window.location.href = "/";
                    }}
                  />
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4 cursor-pointer">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="hover:bg-green-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="top-16 w-auto max-w-sm">
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`
                              ${open ? "text-black" : "text-black/90"}
                              group inline-flex items-center rounded-md px-3 py-2 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                        >
                          <span>Create</span>
                          <ChevronDownIcon
                            className={`${
                              open ? "text-black-300" : "text-black-300/70"
                            }
                                ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-black-300/80`}
                            aria-hidden="true"
                          />
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute z-10 mt-3 w-screen max-w-sm transform px-4 sm:px-0 lg:max-w-1xl">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                              <div className="relative grid gap-8 bg-white p-7">
                                {creations
                                  .filter((item) => item.show)
                                  .map((item) => (
                                    <a
                                      key={item.name}
                                      href={item.href}
                                      className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-black-500/50"
                                    >
                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                                        <item.icon aria-hidden="true" />
                                      </div>
                                      <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">
                                          {item.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {item.description}
                                        </p>
                                      </div>
                                    </a>
                                  ))}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </div>

                <div className="flex-shrink-0">
                  <ConnectButton
                    label="Connect"
                    accountStatus="address"
                    chainStatus="icon"
                    showBalance={false}
                  />
                </div>
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }: { active: boolean }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium"
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="mt-3 space-y-1 px-2 sm:px-3">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-green-700 hover:text-white"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </nav>
      )}
    </Disclosure>
  );
}
