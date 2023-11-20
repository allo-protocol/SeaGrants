import { EPoolStatus } from "@/app/types";
import { formatUnits } from "viem";

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
};

export function stringToColor(text: string) {
  let str = text;
  let hash = 0;
  for (let i = 0; i < str.length / 2; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = Math.floor(200 + (Math.abs(Math.sin(hash + 0)) * 56) % 56);
  const g = Math.floor(200 + (Math.abs(Math.sin(hash + 1)) * 56) % 56);
  const b = Math.floor(200 + (Math.abs(Math.sin(hash + 2)) * 56) % 56);

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

  for (let i = 5; i <= 10; i++) {
    const formattedValue = amountInUnits.toFixed(i);
    if (Number(formattedValue) !== 0) {
      return formattedValue;
    }
  }
  return amountInUnits.toFixed(10);
}

export function isPoolActive(
  allocationStartTime: number,
  allocationEndTime: number,
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
