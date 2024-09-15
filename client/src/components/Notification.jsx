import React, { useEffect, useContext, useState, useRef } from "react";
import { IoNotifications } from "react-icons/io5";
import { getFormattedDate } from "../utils/helpers";
import axios from "axios";
import { GlobalState } from "../context/GlobalState";

function Notification() {
  const { currentUser } = useContext(GlobalState);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationBar, setShowNotificationBar] = useState(false);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current && currentUser) {
      (async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_URL}/api/notifications/${currentUser._id}`,
            { withCredentials: true }
          );
          if (res.data.status === "success") {
          
            setNotifications(res.data.notifications);
            initialRender.current = false;
          }
        } catch (err) {
          console.log(err);
        }
      })();
    } else if (!initialRender.current && !showNotificationBar) {
      (async () => {
        try {
          const res = await axios.patch(
            `${import.meta.env.VITE_URL}/api/notifications`,
            { userId: currentUser._id },
            { withCredentials: true }
          );
          if (res.data.status === "success") {
    
            setNotifications([]);
          }
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [showNotificationBar]);

  return (
    <div className=" h-fit fixed bottom-4  mx-5 ">
      <div
        className="w-6 h-6 shadow-md bg-[#f7f7f7] rounded-full cursor-pointer"
        onClick={() => setShowNotificationBar((prev) => !prev)}
      >
        <div className="h-full">
          <IoNotifications
            className=" text-slate-400 h-full m-auto"
            size={13}
          />

          {notifications?.length > 0 && (
            <span className="absolute w-3 h-3  text-center font-bold font-nunito   text-white top-0 right-0 text-[8px] bg-blue-600 rounded-full">
              <span className="h-full  my-auto">{notifications.length}</span>
            </span>
          )}
        </div>
      </div>
      {showNotificationBar && (
        <div className="w-60 h-64 bg-[#f7f7f7] p-2 right-0 bottom-full translate-x-full absolute  shadow-lg rounded-md overflow-auto">
          <h2 className="font-nunito font-extrabold text-lg border-b-2 pb-1">
            Notifications
          </h2>
          <ul>
            {notifications?.length > 0 ? (
              notifications.map((notification, i) => (
                <li
                  className="text-xs font-lato font-bold flex items-center space-x-2 py-3 pl-1"
                  key={i}
                >
                  <span className="w-1 h-1 bg-blue-600  rounded-full"></span>
                  <span>
                    {notification.message}
                    <span className="block font-medium text-[9px] text-[#878686]">
                      {getFormattedDate(notification.createdAt)}
                    </span>
                  </span>
                </li>
              ))
            ) : (
              <span className="text-[#909090] text-xs font-semibold text-center block w-full mt-3">
                No notifications
              </span>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Notification;
