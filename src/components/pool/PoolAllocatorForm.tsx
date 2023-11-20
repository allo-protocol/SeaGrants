"use client";

import Error from "@/components/shared/Error";
import Modal from "../shared/Modal";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ethereumAddressRegExp } from "@/utils/common";
import { SetAllocatorData } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { PoolContext } from "@/context/PoolContext";

const schema = yup.object().shape({
  allocators: yup.array().of(
    yup.object().shape({
      address: yup
        .string()
        .required("Allocator Address is required")
        .matches(ethereumAddressRegExp, "Invalid Ethereum address"),
      action: yup.string().required("Allocator Action is required"),
    }),
  ),
});

export default function PoolAllocatorForm() {
  const { steps, batchSetAllocator } = useContext(PoolContext);
  const [allocators, setAllocators] = useState([
    { address: "", action: "true" }, // Initial allocator
  ]);

  const params = useParams();

  const chainId = params["chainId"];
  const poolId = params["poolId"];

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
    setAllocators([{ address: "", action: "true" }]);
    setValue("allocators", [{ address: "", action: "true" }]);
  };

  const onHandleSubmit = async (data: any) => {
    setIsOpen(true);
    const allocatorData: SetAllocatorData[] = data.allocators.map(
      (allocator: any) => ({
        allocatorAddress: allocator.address,
        flag: allocator.action === "true" ? true : false,
      }),
    );
    await batchSetAllocator(allocatorData);
    setTimeout(() => {
      handleCancel();
    }, 1000);
  };

  const addAllocator = () => {
    setAllocators((prevAllocators) => [
      ...prevAllocators,
      { address: "", action: "true" },
    ]);
  };

  const removeAllocator = (index: number) => {
    setAllocators((prevAllocators) =>
      prevAllocators.filter((_, i) => i !== index),
    );
  };

  return (
    <form onSubmit={handleSubmit(onHandleSubmit)}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Update Allocators
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Update the list of allocators for this pool.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <table className="w-full text-sm font-medium text-gray-900">
                <thead>
                  <tr>
                    <th className="text-sm font-medium text-gray-900">
                      Allocator Address
                    </th>
                    <th className="text-sm font-medium text-gray-900 px-6">
                      Add/Remove
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {allocators.map((allocator, index: number) => (
                    <>
                      <tr key={index}>
                        <td
                          className={`w-full px-3 ${
                            !errors?.allocators?.[index]?.address && "py-1.5"
                          }`}
                        >
                          <input
                            {...register(`allocators.${index}.address`)}
                            type="text"
                            name={`allocators[${index}].address`}
                            className="block w-full border-1 border-gray-300 bg-transparent py-1.5 px-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="0x1234.."
                          />
                        </td>
                        <td className="px-3">
                          <select
                            {...register(`allocators.${index}.action`)}
                            className="block w-full border-0 bg-transparent py-1.5 px-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="true">Add</option>
                            <option value="false">Remove</option>
                          </select>
                        </td>
                        <td className="">
                          {index > 0 ? (
                            <button
                              type="button"
                              onClick={() => removeAllocator(index)}
                            >
                              &#x2A2F;
                            </button>
                          ) : (
                            <span>&nbsp;</span>
                          )}
                        </td>
                      </tr>
                      {errors?.allocators?.[index]?.address && (
                        <tr className="">
                          <td className="w-[300px] px-3 pb-2">
                            <Error
                              message={
                                errors!.allocators[index]!.address!.message!
                              }
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
              <button
                className="w-full text-right text-sm font-medium text-gray-900 py-3 px-6"
                type="button"
                onClick={addAllocator}
              >
                &#10010;&nbsp;Add Row
              </button>
              <div className="w-full mt-6 flex items-center justify-end gap-x-6 px-6">
                <button
                  type="button"
                  className="bg-red-700 hover:bg-red-500 text-sm font-semibold leading-6 text-white rounded-md px-3 py-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-500 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  Save
                </button>

                <Modal isOpen={isOpen} setIsOpen={setIsOpen} steps={steps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
