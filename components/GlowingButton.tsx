import Image from "next/image";
import React from "react";
import SpinnerIcon from "./ui/SpinnerIcon";
/* From Uiverse.io by shivam_7937 */

export const GlowingButton = ({
  children,
  onSubmit,
  loading,
}: {
  children?: string | React.ReactNode;
  onSubmit?: () => void;
  loading?: boolean;
}) => {
  return (
    <div
      className={`${
        loading ? "opacity-50" : "opacity-100"
      } relative inline-flex items-center justify-center gap-4 group w-fit min-w-[200px]`}
      onClick={onSubmit}
    >
      <div className="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
      <button
        className="min-w-[200px] group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <div className="flex gap-2">
            <p>loading</p>
            <SpinnerIcon className="text-white" />
          </div>
        ) : (
          <>
            {children}
            <svg
              aria-hidden="true"
              viewBox="0 0 10 10"
              height="10"
              width="10"
              fill="none"
              className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
            >
              <path
                d="M0 5h7"
                className="transition opacity-0 group-hover:opacity-100"
              ></path>
              <path
                d="M1 1l4 4-4 4"
                className="transition group-hover:translate-x-[3px]"
              ></path>
            </svg>
          </>
        )}
      </button>
    </div>
  );
};
