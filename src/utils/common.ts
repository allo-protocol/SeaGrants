export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const statusColorsScheme = {
  Paid: "text-blue-700 bg-blue-50 ring-blue-600/20",
  Accepted: "text-green-700 bg-green-50 ring-green-600/20",
  Pending: "text-yellow-600 bg-yellow-50 ring-yellow-500/10",
  Rejected: "text-red-700 bg-red-50 ring-red-600/20",
};
