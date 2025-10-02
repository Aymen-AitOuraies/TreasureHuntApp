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
                <form className="flex flex-col items-center space-y-4 w-full mt-10  text-2xl  text-background">
                    <input type="text" placeholder="Email" className=" bg-primary border-none outline-none  p-3 rounded-md w-[90%] placeholder:text-background" />
                    <input type="password" placeholder="Password" className=" bg-primary border-none outline-none  p-3 rounded-md w-[90%] placeholder:text-background" />
                    <button type="submit" className="bg-secondary text-[24px] p-3 rounded-[27px] w-[90%] cursor-pointer">Login</button>
                </form>
            </div>
        </div>
    );
}