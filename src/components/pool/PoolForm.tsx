"use client";

import Error from "@/components/shared/Error";
import Modal from "../shared/Modal";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TNewPool, TPoolData, TProfilesByOwnerResponse } from "@/app/types";
import { useAccount, useNetwork } from "wagmi";
import { NewPoolContext } from "@/context/NewPoolContext";
import { useRouter } from "next/navigation";
import ImageUpload from "../shared/ImageUpload";
import { MarkdownEditor } from "../shared/Markdown";
import { parseUnits } from "viem";
import getProfilesByOwner from "@/utils/request";
import PoolOverview from "./PoolOverview";

const schema = yup.object({
  profileId: yup
    .string()
    .required("Profile ID is required")
    .test("address-check", "Must start with 0x", (value) =>
      value?.toLowerCase()?.startsWith("0x"),
    ),
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
  useRegistryAnchor: yup.string().required("Registry anchor is required"),
  //todo: fix this
  // profilename: yup.string().when("profileId", {
  //   is: (profileId: string) => profileId.trim() === "0x0",
  //   then: yup
  //     .string()
  //     .required("Profile name is required"),
  //   otherwise: yup.string(),
  // }),
  profilename: yup.string().notRequired(),
});

export default function PoolForm() {
  const [base64Image, setBase64Image] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [profiles, setProfiles] = useState<TProfilesByOwnerResponse[]>([]);
  const [createNewProfile, setCreateNewProfile] = useState<boolean>(false);
  const { steps, createNewPool } = useContext(NewPoolContext);
  const router = useRouter();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [newPoolData, setNewPoolData] = useState<TNewPool | undefined>(
    undefined,
  );

  const nowPlus10Minutes = new Date();
  nowPlus10Minutes.setMinutes(nowPlus10Minutes.getMinutes() + 10);
  const minDate = nowPlus10Minutes.toISOString().slice(0, -8);

  const chainId = chain?.id;

  const handleCancel = () => {
    if (isPreview) {
      setIsPreview(false);
      return;
    } else {
      setIsOpen(false);
      window.location.assign(`/`);
    }
  };

  const onHandlePreview = async (data: any) => {
    // if no new profile is created set undefined
    // else set profile name if available else set pool name instead
    const newProfileName = !createNewProfile
      ? undefined
      : data.profilename
      ? data.profilename
      : data.name;

    const _newPoolData: TNewPool = {
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
      profileName: newProfileName,
    };

    setNewPoolData(_newPoolData);
    setIsPreview(true);
  };

  const createPoolData = (): TPoolData => {
    return {
      poolId: "0",
      chainId: chainId!.toString(),
      strategy: "0x",
      allocationStartTime: Number(newPoolData!.startDate),
      allocationEndTime: Number(newPoolData!.endDate),
      approvalThreshold: newPoolData!.approvalThreshold,
      maxRequestedAmount: newPoolData!.maxAmount,
      blockTimestamp: (new Date().getTime() / 1000).toString(),
      useRegistryAnchor: newPoolData!.useRegistryAnchor,
      pool: {
        strategy: "0x",
        tokenMetadata: {
          name: "",
          symbol: "",
          decimals: 0,
        },
        token: `0x`,
        amount: newPoolData!.fundPoolAmount,
        metadataPointer: "",
        poolBanner: "",
        metadata: {
          name: newPoolData!.name,
          website: newPoolData!.website,
          description: newPoolData!.description,
          profileId: newPoolData!.profileId || "0x00000000000000000000000000",
        },
        profile: {
          profileId: newPoolData?.profileId || "0x00000000000000000000000000",
          name: "",
        },
      },
      allocateds: [],
      distributeds: [],
      microGrantRecipients: [],
    };
  };

  const handleCreateNewPool = async () => {
    if (!newPoolData) return;
    setIsOpen(true);
    const { poolId } = await createNewPool(newPoolData, Number(chainId));

    setTimeout(() => {
      setIsOpen(false);
      router.push(`/${chainId}/${poolId}`);
      router.refresh();
    }, 5000);
  };

  const setText = (text: string) => {
    setValue("description", text);
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      if (chainId && address) {
        const customProfile: TProfilesByOwnerResponse = {
          name: "New Profile",
          profileId: "0x0",
          owner: address.toLocaleLowerCase(),
          createdAt: "0",
          anchor: "0x",
        };

        const profiles: TProfilesByOwnerResponse[] = await getProfilesByOwner({
          chainId: chainId.toString(),
          account: address.toLocaleLowerCase(),
        });

        if (profiles.length === 0) setCreateNewProfile(true);
        profiles.push(customProfile);

        setProfiles(profiles);
      }
    };

    fetchProfiles();
  }, [chain, address]);

  return (
    <form onSubmit={handleSubmit(onHandlePreview)}>
      {!isPreview ? (
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
                  <div className="sm:col-span-4">
                    {profiles.length > 0 && (
                      <select
                        {...register("profileId")}
                        id="profileId"
                        name="profileId"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={profiles[0].profileId}
                        onChange={(e) => {
                          setCreateNewProfile(e.target.value === "0x0");
                        }}
                      >
                        {profiles.map((profile, index) => (
                          <option
                            key={profile.profileId}
                            value={profile.profileId}
                            selected={index === 0}
                          >
                            {`${profile.name} ${
                              profile.profileId === "0x0"
                                ? ""
                                : profile.profileId
                            }`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <p className="text-xs leading-5 text-gray-600 mt-2">
                    The registry profile id of you organization your pool will
                    be linked to
                  </p>
                  <div>
                    {errors.profileId && (
                      <Error message={errors.profileId?.message!} />
                    )}
                  </div>
                </div>
              </div>

              {createNewProfile && (
                <div className="sm:col-span-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Profile Name
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                      <input
                        {...register("profilename")}
                        type="text"
                        name="profilename"
                        id="profilename"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Allo Protocol"
                      />
                    </div>
                  </div>
                  <div>
                    {errors.profilename && (
                      <Error message={errors.profilename?.message!} />
                    )}
                  </div>
                </div>
              )}

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
                      placeholder="Gitcoin Micro Grants"
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
                  {errors.website && (
                    <Error message={errors.website?.message!} />
                  )}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <MarkdownEditor
                  setText={setText}
                  value={newPoolData?.description || ""}
                />
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
                  {errors.endDate && (
                    <Error message={errors.endDate?.message!} />
                  )}
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
              <ImageUpload
                setBase64Image={setBase64Image}
                previewImage={newPoolData?.base64Image || undefined}
              />
            </div>
          </div>
        </div>
      ) : (
        <PoolOverview
          chainId={chainId!.toString()}
          poolId={"0"}
          pool={createPoolData()}
          metadata={createPoolData().pool.metadata}
          poolBanner={newPoolData!.base64Image!}
          applications={[]}
        />
      )}

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="bg-red-700 hover:bg-red-500 text-sm font-semibold leading-6 text-white rounded-md px-3 py-2"
          onClick={handleCancel}
        >
          Cancel
        </button>
        {!isPreview ? (
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-500 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Preview
          </button>
        ) : (
          <button
            onClick={handleCreateNewPool}
            className="bg-green-700 hover:bg-green-500 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Submit
          </button>
        )}

        <Modal isOpen={isOpen} setIsOpen={setIsOpen} steps={steps} />
      </div>
    </form>
  );
}
