import React, { useContext, useState } from "react";
import { GlobalState } from "../context/GlobalState";
import { getFileIcon } from "../utils/helpers";
import { GoDownload } from "react-icons/go";
function showFiles() {
  const { messages } = useContext(GlobalState);
  const [category, setCategory] = useState("photo");
  const fileMessages = messages.filter(
    (msg) => msg.format === category && !msg.deleted
  );

  return (
    <div className="absolute z-50 h-96 overflow-auto scrollbar top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f7f7f7] p-4 w-80 rounded-md shadow-md">
      <h3 className="font-lato  text-center m-2">View Files and Images</h3>
      <div className="flex font-nunito text-sm mb-2">
        <button
          className={`outline-0 bg-[#ececec] w-full p-1 ${
            category === "photo" && "border-2 border-[#333333]"
          }`}
          onClick={() => setCategory("photo")}
        >
          Images
        </button>
        <button
          className={`outline-0 bg-[#ececec] w-full p-1 ${
            category === "file" && "border-2 border-[#333333]"
          }`}
          onClick={() => setCategory("file")}
        >
          Files
        </button>
      </div>
      <ul
        className={`flex flex-wrap ${
          category === "file" && "flex-col"
        } justify-center `}
      >
        {fileMessages.length === 0 ? (
          <p className="text-center font-lato text-sm">No {category}</p>
        ) : (
          fileMessages?.map(
            (msg) =>
              !msg.deleted && (
                <li className=" m-1">
                  {category === "file" ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex items-center w-full text-wrap">
                        {getFileIcon(
                          msg.message.substring(msg.message.indexOf(".") + 1)
                        )}

                        {msg.message.substring(0, msg.message.lastIndexOf("-"))}
                      </span>

                      <a
                        href={`${
                          import.meta.env.VITE_URL
                        }/public/file-uploads/${msg.message}`}
                        downlaod
                        target="_blank"
                      >
                        <GoDownload />
                      </a>
                    </div>
                  ) : (
                    <img
                      src={`${import.meta.env.VITE_URL}/public/img/chats/${
                        msg.message
                      }`}
                      alt="photo"
                      className="w-32 h-32"
                      loading="lazy"
                    />
                  )}
                </li>
              )
          )
        )}
      </ul>
    </div>
  );
}

export default showFiles;
