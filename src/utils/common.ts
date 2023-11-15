export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const statusColorsScheme = {
  Paid: "text-blue-700 bg-blue-50 ring-blue-600/20",
  Accepted: "text-green-700 bg-green-50 ring-green-600/20",
  Pending: "text-yellow-600 bg-yellow-50 ring-yellow-500/10",
  Rejected: "text-red-700 bg-red-50 ring-red-600/20",
};

export function stringToColor2(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let finalHash = hash;
  for (let i = 0; i < str.length / 2; i++) {
    finalHash = str.charCodeAt(i) + ((finalHash << 3) - finalHash);
  }
  for (let i = 0; i < str.length; i++) {
    finalHash = str.charCodeAt(i) + ((finalHash << 5) - finalHash);
  }

  const hue = finalHash % 360;
  const saturation = 50 + (finalHash % 10);
  const lightness = 40 + (finalHash % 10);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function stringToColor(text: string) {
  let str = text;
  let hash = 0;
  for (let i = 0; i < str.length / 2; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = Math.floor((Math.abs(Math.sin(hash + 0)) * 256) % 256);
  const g = Math.floor((Math.abs(Math.sin(hash + 1)) * 256) % 256);
  const b = Math.floor((Math.abs(Math.sin(hash + 2)) * 256) % 256);

  // modulo function on str.length to chose between aa, bb, cc, dd
  const append = ["88", "aa", "66", "99"][str.length % 4];
  // return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}${append}`;
  return `#${toTwoDigits(r)}${toTwoDigits(g)}${toTwoDigits(b)}${append}`
}


function toTwoDigits(n: number) {
  const hexString = n.toString(16);
  return hexString.length === 1 ? `${hexString}${hexString}` : hexString;
}

