"use client";
import { generateToken } from "@/services/jwt";
import Image from "next/image";
import { useState } from "react";
import { BsGoogle } from "react-icons/bs";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await generateToken(email);
  }
  return (
    <main className="">
      <div className=" h-screen flex py-10 px-4 sm:pl-40 bg-[#01A3FF]">
        <div className="hidden rounded-l-4xl lg:flex w-1/2 bg-cover bg-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center overflow-hidden border-r-1 border-gray-400">
            <Image
              src={"/cover.png"}
              alt="Cover"
              height={2400}
              width={2400}
              priority
            ></Image>
          </div>
        </div>

        <div className="flex w-full lg:w-1/2 items-center sm:rounded-r-4xl justify-center sm:p-6  sm:bg-[#F4F4F4]">
          <div className="w-full max-w-md bg-white shadow-[0px_0px_10px_rgb(0,0,0,0.4)] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-black">Login </h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <button
                className="w-full bg-[#01A3FF] text-white py-3 rounded-lg font-semibold cursor-pointer hover:opacity-90 active:scale-95 
                 transition-all duration-200 ease-in-out"
              >
                Login
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Forgot password?{" "}
              <a href="#" className="text-purple-600">
                Reset here
              </a>
            </p>
            <div className="my-6 flex items-center">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <button className="w-full cursor-pointer h-max border text-gray-700 border-gray-300 py-3 rounded-lg flex gap-2 items-center justify-center">
              <BsGoogle size={18} />
              Continue with Google
            </button>
            <p className="text-sm text-gray-600 mt-6 text-center">
              Dont have an account?{" "}
              <a href="/signup" className="text-purple-600">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
