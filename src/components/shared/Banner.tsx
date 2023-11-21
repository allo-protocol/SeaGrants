import { stringToColor } from "@/utils/common";
import { aspectRatio } from "@/utils/config";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const Banner = (props: { image: string | undefined | null; alt: string }) => {
  const bannerRef = useRef<any>(null);
  const [bannerSize, setBannerSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (bannerRef.current) {
      setBannerSize({
        width: bannerRef.current.offsetWidth,
        height: Math.ceil(bannerRef.current.offsetWidth / aspectRatio),
      });
    }
  }, [bannerRef]);

  return (
    <>
      {props.image && props.image !== "" ? (
        <Image
          src={props.image}
          alt={props.alt}
          className="h-full w-full object-cover object-center"
          width={bannerSize.width}
          height={bannerSize.height}
        />
      ) : (
        <div
          className="flex items-center justify-center"
          style={{
            width: `${bannerSize.width}px`,
            height: `${bannerSize.height}px`,
            backgroundColor: stringToColor(
              props.alt ?? (Math.random() * 10000).toString(),
            ),
          }}
        >
          <span className="text-gray-400 text-3xl">{props.alt}</span>
        </div>
      )}
    </>
  );
};

export default Banner;
