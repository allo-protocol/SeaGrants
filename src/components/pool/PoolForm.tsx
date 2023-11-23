"use client";

import Error from "@/components/shared/Error";
import Modal from "../shared/Modal";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TNewPool } from "@/app/types";
import { useNetwork } from "wagmi";
import { NewPoolContext } from "@/context/NewPoolContext";
import { useRouter } from "next/navigation";
import ImageUpload from "../shared/ImageUpload";
import { MarkdownEditor } from "../shared/Markdown";
import { parseUnits } from "viem";

const schema = yup.object({
  profileId: yup.string().required("Recipient address is required"),
  name: yup.string().required().min(6, "Must be at least 6 characters"),
  website: yup.string().required().url("Must be a valid website address"),
  description: yup.string().required().min(10, "Must be at least 150 words"),
  fundPoolAmount: yup
    .string()
    .test(
      "is-number",
      "fund pool amount is required",
      (value) => !isNaN(Number(value)),
    ),
  maxAmount: yup
    .string()
    .test(
      "is-number",
      "max amount is required",
      (value) => !isNaN(Number(value)),
    ),
  approvalThreshold: yup.number().required("approval threshold is required"),
  startDate: yup.date().required("Start time is required"),
  endDate: yup.date().required("End time is required"),
  tokenAddress: yup.string().notRequired(),
  useRegistryAnchor: yup.boolean().required("Registry anchor is required"),
});

export default function PoolForm() {
  const [base64Image, setBase64Image] = useState<string>("");
  const nowPlus10Minutes = new Date();
  nowPlus10Minutes.setMinutes(nowPlus10Minutes.getMinutes() + 10);
  const minDate = nowPlus10Minutes.toISOString().slice(0, -8);

  const router = useRouter();
  const { steps, createNewPool } = useContext(NewPoolContext);

  const { chain } = useNetwork();
  const chainId = chain?.id;

  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    setIsOpen(false);
  };

  const onHandleSubmit = async (data: any) => {
    setIsOpen(true);

    const newPoolData: TNewPool = {
      profileId: data.profileId,
      name: data.name,
      website: data.website,
      description: data.description,
      tokenAddress: data.tokenAddress
        ? data.tokenAddress
        : "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      fundPoolAmount: parseUnits(data.fundPoolAmount, 18).toString(),
      maxAmount: parseUnits(data.maxAmount, 18).toString(),
      approvalThreshold: data.approvalThreshold,
      startDate: data.startDate,
      endDate: data.endDate,
      useRegistryAnchor: data.useRegistryAnchor === "true" ? true : false,
      managers: [],
      base64Image: base64Image,
    };

    const { address, poolId } = await createNewPool(
      newPoolData,
      Number(chainId),
    );

    setTimeout(() => {
      setIsOpen(false);
      router.push(`/${chainId}/${poolId}`);
    }, 1000);
  };

  const setText = (text: string) => {
    setValue("description", text);
  };

  return (
    <form onSubmit={handleSubmit(onHandleSubmit)}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              New Pool
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be stored on IPFS and added as metadata to
              the pool.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-full">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Selected Chain
              </label>
              <div className="mt-2">
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  {chain?.name} ({chain?.id})
                </p>
              </div>
            </div>

            <div className="sm:col-span-full">
              <label
                htmlFor="profileId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Registry Profile ID
              </label>
              <div className="mt-2">
                <input
                  {...register("profileId")}
                  type="text"
                  name="profileId"
                  id="profileId"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div>
                  {errors.profileId && (
                    <Error message={errors.profileId?.message!} />
                  )}
                </div>
                {/* <div className="sm:col-span-4">
                  <label
                    htmlFor="useRegistryAnchor"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Registry Profile ID
                  </label>
                  <select
                    {...register("profileId")}
                    id="profileId"
                    name="profileId"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue="false"
                  >
                    <option>0x1234</option>
                    <option>0x456</option>
                  </select>
                </div> */}
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  The registry profile id of you organization your pool will be
                  linked to
                </p>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Pool Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    {...register("name")}
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="sporkdao"
                  />
                </div>
              </div>
              <div>
                {errors.name && <Error message={errors.name?.message!} />}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="website"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Website
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    {...register("website")}
                    type="text"
                    name="website"
                    id="website"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
              <div>
                {errors.website && <Error message={errors.website?.message!} />}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <MarkdownEditor setText={setText} />
              {/* Register the "description" field */}
              <input
                {...register("description")}
                type="hidden" // Hidden because MarkdownEditor handles the input
              />
              <p className="text-xs leading-5 text-gray-600 mt-2">
                Write a brief description about the pool and who is allowed to
                apply
              </p>
              <div>
                {errors.description && (
                  <Error message={errors.description?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-full">
              <label
                htmlFor="tokenAddress"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Pool Token Address
              </label>
              <div className="mt-2">
                <input
                  {...register("tokenAddress")}
                  type="text"
                  name="tokenAddress"
                  id="tokenAddress"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  The address of the token that will be used to fund the pool.
                  Leave blank to use the native currency.
                </p>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="fundPoolAmount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Fund Pool Amount
              </label>
              <div className="mt-2">
                <input
                  {...register("fundPoolAmount")}
                  id="fundPoolAmount"
                  name="fundPoolAmount"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  The amount of tokens to fund the pool with.
                </p>
              </div>
              <div>
                {errors.fundPoolAmount && (
                  <Error message={errors.fundPoolAmount?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="maxAmount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Max Grant Amount
              </label>
              <div className="mt-2">
                <input
                  {...register("maxAmount")}
                  id="maxAmount"
                  name="maxAmount"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  The max amount that can be requested by an applicant.
                </p>
              </div>
              <div>
                {errors.maxAmount && (
                  <Error message={errors.maxAmount?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="approvalThreshold"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Approval Threshold
              </label>
              <div className="mt-2">
                <input
                  min={1}
                  {...register("approvalThreshold")}
                  id="approvalThreshold"
                  name="approvalThreshold"
                  type="number"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.approvalThreshold && (
                  <Error message={errors.approvalThreshold?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start Date
              </label>
              <div className="mt-2">
                <input
                  min={minDate}
                  {...register("startDate")}
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.startDate && (
                  <Error message={errors.startDate?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Date
              </label>
              <div className="mt-2">
                <input
                  min={minDate}
                  {...register("endDate")}
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.endDate && <Error message={errors.endDate?.message!} />}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="useRegistryAnchor"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Registry Profile Required
              </label>
              <select
                {...register("useRegistryAnchor")}
                id="useRegistryAnchor"
                name="useRegistryAnchor"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue="false"
              >
                <option>true</option>
                <option>false</option>
              </select>
            </div>
            <ImageUpload setBase64Image={setBase64Image} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="bg-red-700 hover:bg-red-500 text-sm font-semibold leading-6 text-white rounded-md px-3 py-2"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-500 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm"
        >
          Save
        </button>

        <Modal isOpen={isOpen} setIsOpen={setIsOpen} steps={steps} />
      </div>
    </form>
  );
}
