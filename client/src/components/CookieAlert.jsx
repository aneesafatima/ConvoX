import React from "react";
import { PiCookieBold } from "react-icons/pi";

function CookieAlert({ setShowCookieAlert }) {
  return (
    <div className="bg-white shadow-lg flex justify-center flex-col w-svw lg:w-80 lg:py-3 font-nunito text-sm space-y-1 absolute p-2 bottom-0 rounded-lg lg:m-3">
      <div className="flex text-blue-400 justify-center items-center space-x-1">
        <PiCookieBold className=" " size={25} />
        <h1 className="text-lg  font-lato font-bold pointer-events-none">
          Cookies Required
        </h1>
      </div>
      <p className="text-xs lg:text-center pointer-events-none">
        To use this application, you'll need to have cookies enabled in your
        browser, as they are required for authentication and key functionality.
        Please ensure cookies are turned on in your browser settings for the
        best experience.
      </p>

      <button
        type="submit"
        className="py-1 px-3 mx-auto rounded-lg bg-blue-400 text-[#f2f2f2] hover:bg-blue-500 text-xs sm:text-sm font-light font-lato "
        onClick={() => setShowCookieAlert(false)}
      >
        Got it
      </button>
    </div>
  );
}

export default CookieAlert;
