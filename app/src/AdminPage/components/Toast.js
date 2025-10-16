import React, { useEffect } from "react";
import { Icon } from "@iconify/react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      bgColor: "bg-green-500",
      icon: "mdi:check-circle",
      iconColor: "text-white"
    },
    error: {
      bgColor: "bg-red-500",
      icon: "mdi:alert-circle",
      iconColor: "text-white"
    },
    info: {
      bgColor: "bg-blue-500",
      icon: "mdi:information",
      iconColor: "text-white"
    },
    warning: {
      bgColor: "bg-yellow-500",
      icon: "mdi:alert",
      iconColor: "text-white"
    }
  };

  const { bgColor, icon, iconColor } = config[type] || config.success;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}>
        <Icon icon={icon} className={`text-3xl ${iconColor} flex-shrink-0`} />
        <p className="font-cormorant text-lg font-semibold flex-1">{message}</p>
        <button
          onClick={onClose}
          className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
        >
          <Icon icon="mdi:close" className="text-xl" />
        </button>
      </div>
    </div>
  );
}
