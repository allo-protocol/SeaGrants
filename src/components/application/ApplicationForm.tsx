"use client";

import { PhotoIcon } from "@heroicons/react/20/solid";
import { ProgressStatus } from "@/components/shared/ProgressFeed";
import Error from "@/components/shared/Error";
import Modal from "../shared/Modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const steps = [
  {
    id: 1,
    content: "Saving your application to ",
    target: "IPFS",
    // TODO: Change to actual IPFS link
    href: "https://ipfs.ip/ipfs/0xwetvy2345tvbyuk23c45vtvbyuiv523tvbyuitbyuf5tvyu23cf45yu",
    status: ProgressStatus.IS_SUCCESS,
  },
  {
    id: 2,
    content: "Submitted application on",
    target: "Celo network",
    href: "#",
    status: ProgressStatus.IN_PROGRESS,
  },
  {
    id: 3,
    content: "Indexing your application",
    target: "Spec",
    href: "#",
    status: ProgressStatus.IN_PROGRESS,
  },
  {
    id: 4,
    content: "Redirecting to your application page",
    target: "Bethany Blake",
    href: "#",
    status: ProgressStatus.NOT_STARTED,
  },
];

const schema = yup.object({
  name: yup.string().required().min(6, "Must be at least 6 characters"),
  website: yup.string().required().url("Must be a valid website address"),
  description: yup.string().required().min(150, "Must be at least 150 words"),
  email: yup.string().required().min(3).email("Must be a valid email address"),
  recipientAddress: yup.string().required("Recipient address is required"),
  imageUrl: yup.string().required().url("Must be a valid image url"),
  profileOwner: yup.string().required("A profile owner is required"),
  nonce: yup.number().required("A nonce is required").min(1),
});

export default function ApplicationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    // getValues,
    formState: { errors },
  } = useForm({
    // NOTE: Comment out to test
    // resolver: yupResolver(schema),
  });

  // NOTE: REMOVE IF NOT NEEDED
  // const {
  //   name,
  //   website,
  //   description,
  //   email,
  //   recipientAddress,
  //   imageUrl,
  //   profileOwner,
  //   nonce,
  // } = getValues();

  const handleCancel = () => {
    console.log("cancel");
    setIsOpen(false);

    window.location.assign("/");
  };

  const onHandleSubmit = (data: any) => {
    setIsOpen(true);

    setValue("name", data.name);
    setValue("website", data.website);
    setValue("description", data.description);
    setValue("email", data.email);
    setValue("recipientAddress", data.recipientAddress);
    setValue("imageUrl", data.imageUrl);
    setValue("profileOwner", data.profileOwner);
    setValue("nonce", data.nonce);

    console.log("submit", data);
  };

  return (
    <form onSubmit={handleSubmit(onHandleSubmit)}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Project
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be stored on IPFS and will be reviewed by
              the pool managers
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
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
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    http://
                  </span>
                  <input
                    {...register("website")}
                    type="text"
                    name="website"
                    id="website"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="www.example.com"
                  />
                </div>
              </div>
              <div>
                {errors.website && <Error message={errors.website?.message!} />}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  {...register("description")}
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              <div>
                {errors.description && (
                  <Error message={errors.description?.message!} />
                )}
              </div>
              <p className="text-xs leading-5 text-gray-600 mt-2">
                Write a brief description about the project and why it&apos;s
                applying to the round
              </p>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  {...register("email")}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.email && <Error message={errors.email?.message!} />}
              </div>
            </div>

            <div className="sm:col-span-full">
              <label
                htmlFor="recipientAddress"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Recipient Address
              </label>
              <div className="mt-2">
                <input
                  {...register("recipientAddress")}
                  type="text"
                  name="recipientAddress"
                  id="recipientAddress"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
                <div>
                  {errors.recipientAddress && (
                    <Error message={errors.recipientAddress?.message!} />
                  )}
                </div>
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  The wallet to which the funds would be sent to.
                </p>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cover photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="imageUrl"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500"
                    >
                      <span>Upload a file</span>
                      <input
                        {...register("imageUrl")}
                        id="imageUrl"
                        name="imageUrl"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600 mt-2">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              A profile will be created on the registry to maintain your
              project. Additonally an anchor wallet would be created which will
              be controlled by the profile. The anchor creation requires a nonce
              unique to the owner. You can use the anchor wallet to recive funds
              , gather attestations and generate reputation for your project.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-full">
              <label
                htmlFor="profile-owner"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profile Owner
              </label>
              <div className="mt-2">
                <input
                  {...register("profileOwner")}
                  type="text"
                  name="profileOwner"
                  id="profileOwner"
                  placeholder=" 0x..."
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.profileOwner && (
                  <Error message={errors.profileOwner?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="nonce"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nonce
              </label>
              <div className="mt-2">
                <input
                  {...register("nonce")}
                  type="number"
                  name="nonce"
                  id="nonce"
                  placeholder="1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.nonce && <Error message={errors.nonce?.message!} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900 hover:text-white hover:bg-red-500 rounded-md px-3 py-2"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-green-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
        >
          Save
        </button>

        <Modal isOpen={isOpen} setIsOpen={setIsOpen} steps={steps} />
      </div>
    </form>
  );
}
