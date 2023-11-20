"use client";

import Error from "@/components/shared/Error";
import Modal from "../shared/Modal";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ethereumAddressRegExp } from "@/utils/common";
import { SetAllocatorData } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { PoolContext } from "@/context/PoolContext";
import Tooltip from "../shared/Tooltip";

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

  const handleCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const text = await file.text();

      const rows = text.split("\n");
      const newAllocators: { address: string; action: string }[] = [];
      rows.map((row) => {
        const [address, action] = row.split(",");
        // if address matches ethereumAddressRegExp add to newAllocators
        if (address.match(ethereumAddressRegExp)) {
          newAllocators.push({
            address,
            action: action?.replace(" ", "") === "false" ? "false" : "true",
          });
        }
      });

      updateAllocators(newAllocators);
    }
  };

  const updateAllocators = (
    newAllocators: { address: string; action: string }[],
  ) => {
    if (allocators.length === 1 && allocators[0].address === "") {
      dedupeAllocators(newAllocators);
    } else {
      dedupeAllocators([...allocators, ...newAllocators]);
    }
  };

  const dedupeAllocators = (data: { address: string; action: string }[]) => {
    const uniqueAllocators = Array.from(
      new Map(
        [...data].map((allocator) => [allocator.address, allocator]),
      ).values(),
    );

    setAllocators(uniqueAllocators);
    setValue("allocators", uniqueAllocators);
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
              <div className="flex relative">
                <button
                  className="w-full text-right text-sm font-medium text-gray-900 py-3 px-1 group-hover:opacity-90"
                  type="button"
                  onClick={() => {
                    document.getElementById("csvFileUpload")!.click();
                  }}
                >
                  <span className="font-bold">&#x21A5;</span>&nbsp;Upload CSV
                </button>
                <Tooltip>
                  <div className="font-bold mt-0.5 pl-1">Allowed formats:</div>
                  <div className="font-semibold font-mono mt-0.5 pl-1">
                    address,(bool)
                  </div>
                  <div className="font-normal font-mono pl-1">0x123..89</div>
                  <div className="font-normal font-mono pl-1">
                    0x456..7a,false
                  </div>
                  <div className="font-normal font-mono pl-1">
                    0x123..89,true
                  </div>
                  <div className="font-semibold mt-0.5 pl-1">Legend:</div>
                  <div className="font-normal pl-1">No bool &#x2192; Add</div>
                  <div className="font-normal pl-1">true &#x2192; Add</div>
                  <div className="font-normal pl-1">false &#x2192; Remove</div>
                </Tooltip>
              </div>
              <input
                type="file"
                id="csvFileUpload"
                name="csvFileUpload"
                className="hidden"
                onChange={handleCSVUpload}
              />{" "}
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
                    <React.Fragment key={index}>
                      <tr key={`fragment-${index}`}>
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
                            <option id={`option[${index}].true`} value="true">
                              Add
                            </option>
                            <option id={`option[${index}].false`} value="false">
                              Remove
                            </option>
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
                    </React.Fragment>
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
              <button
                className="w-full text-right text-sm font-medium text-gray-900 px-6"
                type="button"
                onClick={() => {
                  setAllocators([{ address: "", action: "true" }]);
                  setValue("allocators", [{ address: "", action: "true" }]);
                }}
              >
                <span className="font-bold text-base">&#x2298;</span>
                &nbsp;Clear
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
