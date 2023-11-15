"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ReactCrop, { type Crop, makeAspectCrop } from "react-image-crop";

export default function CropModal(props: {
  file: any;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openModalText?: string;
  closeModalText?: string;
  title?: string;
}) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropValues, setCropValues] = useState({} as Crop);
  const [crop, setCrop] = useState(cropValues);
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);

  function closeModal() {
    props.setIsOpen(false);
  }

  function openModal() {
    props.setIsOpen(true);
  }

  useEffect(() => {
    if (props.file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as unknown as string);
      };
      reader.readAsDataURL(props.file);
      if (reader) {
        const image = new Image();
        image.src = reader!.result as unknown as string;
        image.onload = () => {
          setImageSize({ width: image.width, height: image.height });
        };

        setCropValues(
          makeAspectCrop(
            {
              unit: "%",
              width: 90,
            },
            16 / 9,
            image.width,
            image.height,
          ),
        );
      }
    }
  }, [props.file]);

  const handleCropChange = (newCrop: any) => {
    setCrop(newCrop);
  };

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    console.log(croppedArea, croppedAreaPixels);
    // You can store croppedArea or croppedAreaPixels in your state or handle it as needed
  };

  const handleDone = () => {
    // Do something with the cropped image, for example, save it to state or send it to the server
    props.setIsOpen(false);
  };

  const handleClose = () => {
    props.setIsOpen(false);
  };

  return (
    <>
      {props.openModalText && (
        <div className="fixed inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={openModal}
            className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
          >
            {props.openModalText}
          </button>
        </div>
      )}

      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {props.title && (
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      {props.title}
                    </Dialog.Title>
                  )}
                  fml
                  {imageSrc && (
                    <ReactCrop
                      crop={crop} // error here
                      onChange={(c) => setCrop(c)}
                    >
                      Yo
                      <img src={imageSrc as unknown as string} />
                    </ReactCrop>
                  )}
                  {props.closeModalText && (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="text-right rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={closeModal}
                      >
                        {props.closeModalText}
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
