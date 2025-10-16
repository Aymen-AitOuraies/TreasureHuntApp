import React from "react";

export default function DecorativeTitle({ title, className = "" }) {
    return (
        <div className={`flex items-center justify-center mb-2 mt-20 ${className}`}>
            <div className="relative flex items-center">
                <div className="w-20 h-0.5 bg-black"></div>
                <div className="absolute right-3 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute right-0 w-3 h-3 bg-black rounded-full"></div>
            </div>
            <h1 className="text-[28px] font-bold font-cormorant text-secondary text-black mx-4">{title}</h1>
            <div className="relative flex items-center">
                <div className="w-20 h-0.5 bg-black"></div>
                <div className="absolute left-3 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute left-0 w-3 h-3 bg-black rounded-full"></div>
            </div>
        </div>
    );
}