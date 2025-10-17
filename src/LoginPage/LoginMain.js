import React, { useState } from "react";
import { loginPlayer, savePlayerToLocalStorage } from "./services/authService";

export default function LoginPage({ onLoginSuccess }) {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setLoading(true);

        try {
            const response = await loginPlayer({
                fullName: fullName.trim(),
                username: username.trim(),
            });

            if (response.success && response.data) {
                savePlayerToLocalStorage(response.data);
                
                if (onLoginSuccess) {
                    onLoginSuccess(response.data);
                }
            } else {
                setError(response.message || "Failed to join the game");
                if (response.fieldsErrors) {
                    setFieldErrors(response.fieldsErrors);
                }
            }
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
            if (err.fieldsErrors) {
                setFieldErrors(err.fieldsErrors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="h-screen w-full bg-center font-cormorant bg-no-repeat block md:hidden relative overflow-y-auto"
            style={{
                backgroundImage: "url('/assets/AuthAssets/LoginBackground.png')",
                backgroundSize: '100% 100%',
            }}
        >
            <div className="flex items-center justify-center min-h-full flex-col px-6 pt-[35vh] pb-28">
                <div className="text-center w-full mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary leading-tight">
                        Welcome To Treasure Hunt
                    </h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-full space-y-4">
                    <div className="w-[90%] max-w-md">
                        <input 
                            type="text" 
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`bg-primary border-2 ${fieldErrors.fullName ? 'border-secondary' : 'border-transparent'} outline-none p-3 rounded-md w-full placeholder:text-background text-background font-cormorant text-xl`}
                            required
                            disabled={loading}
                        />
                        {fieldErrors.fullName && (
                            <p className="text-secondary text-sm mt-1 ml-2 font-cormorant font-semibold">{fieldErrors.fullName}</p>
                        )}
                    </div>
                    
                    <div className="w-[90%] max-w-md">
                        <input 
                            type="text" 
                            placeholder="Intra Login"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`bg-primary border-2 ${fieldErrors.username ? 'border-secondary' : 'border-transparent'} outline-none p-3 rounded-md w-full placeholder:text-background text-background font-cormorant text-xl`}
                            required
                            disabled={loading}
                        />
                        {fieldErrors.username && (
                            <p className="text-secondary text-sm mt-1 ml-2 font-cormorant font-semibold">{fieldErrors.username}</p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-primary/20 border-l-4 border-secondary text-secondary px-4 py-3 rounded-lg w-[90%] max-w-md">
                            <p className="font-cormorant text-base font-semibold">{error}</p>
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`bg-secondary text-background text-[24px] font-bold p-3 rounded-[27px] w-[90%] max-w-md cursor-pointer transition-opacity ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                        {loading ? 'Joining...' : 'Join the Game'}
                    </button>
                </form>
            </div>
            
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <img 
                    src="/assets/AuthAssets/1337Logo.png" 
                    alt="1337 Logo" 
                    className="h-20 sm:h-24 md:h-32 w-auto"
                />
            </div>
        </div>
    );
}