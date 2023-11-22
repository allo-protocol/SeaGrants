import { EPoolStatus } from "@/app/types";
import { formatUnits } from "viem";
import { graphqlEndpoint } from "./query";
import request from "graphql-request";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const statusColorsScheme = {
  Accepted: "text-green-700 bg-green-50 ring-green-600/20",
  Active: "text-green-700 bg-green-50 ring-green-600/20",

  Upcoming: "text-blue-700 bg-blue-50 ring-blue-600/20",
  Paid: "text-blue-700 bg-blue-50 ring-blue-600/20",

  Pending: "text-yellow-600 bg-yellow-50 ring-yellow-600/20",
  Rejected: "text-red-700 bg-red-50 ring-red-600/10",

  Ended: "text-gray-600 bg-gray-50 ring-gray-500/10",
  Undefined: "text-gray-600 bg-gray-50 ring-gray-500/10",
};

export function stringToColor(text: string) {
  let str = text;
  let hash = 0;
  for (let i = 0; i < str.length / 2; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = Math.floor(200 + ((Math.abs(Math.sin(hash + 0)) * 56) % 56));
  const g = Math.floor(200 + ((Math.abs(Math.sin(hash + 1)) * 56) % 56));
  const b = Math.floor(200 + ((Math.abs(Math.sin(hash + 2)) * 56) % 56));

  // modulo function on str.length to choose between aa, bb, cc, dd
  const append = ["88", "aa", "66", "99"][str.length % 4];
  return `#${toTwoDigits(r)}${toTwoDigits(g)}${toTwoDigits(b)}${append}`;
}

function toTwoDigits(value: number) {
  const hex = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function humanReadableAmount(amount: string, decimals?: number) {
  const amountInUnits = Number(formatUnits(BigInt(amount), decimals || 18));

  for (let i = 5; i <= 15; i++) {
    const formattedValue = amountInUnits.toFixed(i);
    if (Number(formattedValue) !== 0) {
      return formattedValue;
    }
  }
  return 0;
}

export function isPoolActive(
  allocationStartTime: number,
  allocationEndTime: number
) {
  const now = Date.now() / 1000;
  return now >= allocationStartTime && now <= allocationEndTime;
}

export const prettyTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  return `${date.toLocaleDateString()}`;
};

export const ethereumAddressRegExp = /^(0x)?[0-9a-fA-F]{40}$/;

export const getPoolStatus = (startDate: number, endDate: number): EPoolStatus => {
  const now = new Date().getTime() / 1000;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (now < start) {
    return EPoolStatus.UPCOMING;
  } else if (now > end) {
    return EPoolStatus.ENDED;
  } else {
    return EPoolStatus.ACTIVE;
  }
};

export const pollUntilDataIsIndexed = async (
  QUERY_ENDPOINT: any,
  data: any,
  propToCheck: string
) => {
  let counter = 0;
  const fetchData: any = async () => {
    const response: any = await request(graphqlEndpoint, QUERY_ENDPOINT, data);

    console.log("response", response);

    if (response && response[propToCheck] !== null) {
      // Data is found, return true
      return true;
    } else {
      counter++;

      if (counter > 20) return false;

      // If the data is not indexed, schedule the next fetch after 2 seconds
      return new Promise((resolve) => setTimeout(resolve, 2000)).then(
        fetchData
      );
    }
  };

  // Initial fetch
  return await fetchData();
};

export const convertBytesToShortString = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const convertAddressToShortString = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const copy = (data: string) => {
  navigator.clipboard.writeText(data);
};