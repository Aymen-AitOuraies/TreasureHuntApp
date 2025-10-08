import React from "react";
import DecorativeTitle from "../components/DecorativeTitle";

export default function LoginPage() {
    return (
        <div 
            className="h-screen w-full bg-center font-cormorant bg-no-repeat block md:hidden"
            style={{
                backgroundImage: "url('/assets/AuthAssets/LoginBackground.png')",
                backgroundSize: '100% 100%',
            }}
        >
            <div className="flex items-center justify-center h-full flex-col pt-80">
                <div className="text-center w-full">
                    <DecorativeTitle title="Login" />
                    <p className="text-[16px] text-gray-600">Welcome To UM6P Treasure Hunt</p>
                </div>
                <div className="flex flex-col items-center w-full mt-10">
                    <button 
                        type="button" 
                        className="bg-secondary text-background text-[24px] font-bold p-3 rounded-[27px] w-[90%] cursor-pointer"
                    >
                        Login with Intra
                    </button>
                </div>
            </div>
        </div>
    );
}