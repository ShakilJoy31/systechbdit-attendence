"use client";

import { MdCancel } from "react-icons/md";
import { IoShield } from "react-icons/io5";

const BackupPlan = ({ dataProtection, setDataProtection }) => {
  return (
    <div className="block mx-auto py-10">
      <div className="grid md:flex ">
        {/* Side Labels */}
        <div className="md:flex flex-col justify-end pb-8.5 w-64 hidden">
          <span className="text-gray-700 dark:text-gray-300 py-1 bg-gray-200 dark:bg-gray-700 pl-10">
            Mode
          </span>
          <span className="text-gray-700 dark:text-gray-300 py-1 pl-10">
            Frequency
          </span>
          <span className="text-gray-700 dark:text-gray-300 py-1 bg-gray-200 dark:bg-gray-700 pl-10">
            Recovery
          </span>
          <span className="text-gray-700 dark:text-gray-300 py-1 pl-10">
            Backup Retention
          </span>
        </div>

        {/* Auto Backup Card */}
        <div
          className={`relative border-3 ${
            dataProtection ? "border-green-600" : "border-black dark:border-gray-300"
          } rounded-xl w-full md:w-[320px] mx-1 md:mx-0`}
        >
          {/* Recommendation Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-100 dark:bg-yellow-700 text-gray-800 dark:text-gray-200 text-sm px-3 rounded-[3px] w-42 flex justify-center font-semibold border border-black dark:border-gray-300">
            Our Recommendation
          </div>

          {dataProtection && (
            <div
              onClick={() => setDataProtection(false)}
              className="absolute -top-5 right-1 hover:cursor-pointer -translate-x-1/2 p-1 rounded-full text-gray-800 dark:text-gray-200 flex justify-center font-semibold"
            >
              <MdCancel
                className="bg-white dark:bg-gray-800 rounded-full"
                size={30}
                color={"black"}
              ></MdCancel>
            </div>
          )}

          {/* Icon */}
          <div className="absolute -left-9.5 top-12 border-0 m-0 p-0 ">
            <IoShield
              className={`text-7xl pl-2 md:pl-0 ${
                dataProtection
                  ? "text-green-700"
                  : "text-black dark:text-gray-300"
              }`}
            />
          </div>

          {/* Content */}
          <div
            className={`text-center px-6 pt-6 pb-6 ${
              dataProtection
                ? "bg-green-100 dark:bg-green-900 rounded-tr-xl rounded-tl-xl"
                : ""
            } `}
          >
            <h2
              className={`text-xl font-bold ${
                dataProtection
                  ? "text-green-700"
                  : "text-gray-800 dark:text-gray-200"
              } `}
            >
              Auto Backup
            </h2>
            <p
              className={`${
                dataProtection
                  ? "text-green-600"
                  : "text-gray-700 dark:text-gray-300"
              } mt-1 text-lg`}
            >
              $5.99/month
            </p>
            <p
              className={`${
                dataProtection
                  ? "text-green-600"
                  : "text-gray-600 dark:text-gray-400"
              } mt-2 text-lg`}
            >
              Set it and forget it.
            </p>
            <p
              className={`${
                dataProtection
                  ? "text-green-600"
                  : "text-gray-600 dark:text-gray-400"
              } text-lg`}
            >
              Data security with no effort
            </p>
          </div>

          {/* Table */}
          <div className="border-t-3 border-black dark:border-gray-300 mb-8 ">
            <div className="flex justify-between md:justify-center px-6 py-1 bg-gray-200 dark:bg-gray-700">
              <span className="text-gray-700 dark:text-gray-300 block md:hidden ">
                Mode
              </span>
              <span
                className={`${
                  dataProtection
                    ? "text-green-600"
                    : "text-gray-700 dark:text-gray-300"
                } `}
              >
                automated
              </span>
            </div>
            <div className="flex justify-between md:justify-center px-6 py-1">
              <span className="text-gray-700 dark:text-gray-300 block md:hidden ">
                Frequency
              </span>
              <span
                className={`${
                  dataProtection
                    ? "text-green-600"
                    : "text-gray-700 dark:text-gray-300"
                } `}
              >
                daily
              </span>
            </div>
            <div className="flex justify-between md:justify-center px-6 py-1 bg-gray-200 dark:bg-gray-700">
              <span className="text-gray-700 dark:text-gray-300 block md:hidden ">
                Recovery
              </span>
              <span
                className={`${
                  dataProtection
                    ? "text-green-600"
                    : "text-gray-700 dark:text-gray-300"
                } `}
              >
                1-Click Recovery
              </span>
            </div>
            <div className="flex justify-between md:justify-center px-6 py-1">
              <span className="text-gray-700 dark:text-gray-300 block md:hidden ">
                Backup Retention
              </span>
              <span
                className={`${
                  dataProtection
                    ? "text-green-600"
                    : "text-gray-700 dark:text-gray-300"
                } `}
              >
                10
              </span>
            </div>
          </div>

          {/* Button */}
          {!dataProtection && (
            <div className="flex justify-center absolute -bottom-5.5 left-1/2 -translate-x-1/2 ">
              <button
                onClick={() => setDataProtection(true)}
                className="bg-[#0070d2] text-white font-semibold p-2 rounded-full hover:cursor-pointer "
              >
                Select and add
              </button>
            </div>
          )}
        </div>

        {/* None Card */}
        <div className="flex flex-col justify-end ml-2 mt-6 md:mt-0 md:ml-6 ">
          <div
            className={`border-3 relative ${
              dataProtection
                ? "border-gray-400 dark:border-gray-600"
                : "border-black dark:border-gray-300"
            } rounded-xl md:w-[220px] w-full h-[215px] `}
          >
            {dataProtection && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/60 rounded-xl z-10"></div>
            )}
            <div className="text-center px-6 py-2 ">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                None
              </h2>
            </div>

            {/* Table */}
            <div className="border-t-3 border-black dark:border-gray-300">
              <div className="flex justify-between md:justify-center px-6 py-1 bg-gray-200 dark:bg-gray-700">
                <span className="text-gray-700 dark:text-gray-300 block md:hidden">
                  Mode
                </span>
                <span className="text-gray-700 dark:text-gray-300">manual</span>
              </div>
              <div className="flex justify-between md:justify-center px-6 py-1">
                <span className="text-gray-700 dark:text-gray-300 block md:hidden">
                  Frequency
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  on demand
                </span>
              </div>
              <div className="flex justify-between md:justify-center px-6 py-1 bg-gray-200 dark:bg-gray-700">
                <span className="text-gray-700 dark:text-gray-300 block md:hidden">
                  Recovery
                </span>
                <span className="text-gray-700 dark:text-gray-300">manual</span>
              </div>
              <div className="flex justify-between md:justify-center px-6 py-1">
                <span className="text-gray-700 dark:text-gray-300 block md:hidden">
                  Backup Retention
                </span>
                <span className="text-gray-700 dark:text-gray-300">X</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupPlan;
