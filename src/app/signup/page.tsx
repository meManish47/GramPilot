"use client";

import { useState } from "react";
import { validateSignUpForm } from "@/actions/actions";
import Image from "next/image";
import { toast } from "sonner";
import { gql } from "graphql-request";
import { gqlClient } from "@/services/graphql";
import { BsGoogle } from "react-icons/bs";
import Link from "next/link";
const CREATE_USER = gql`
  mutation Mutation($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      success
      message
    }
  }
`;
export default function SignPage() {
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await validateSignUpForm(formData);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setError(null);
    const data: { createUser: { success: boolean; message: string } } =
      await gqlClient.request(CREATE_USER, { email, password, name });
    if (data.createUser.success) {
      toast.success("Success");
      window.location.href = "/login";
      setLoading(false);
    } else {
      toast.error(data.createUser.message);
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="h-screen flex py-10 px-4 sm:pl-40 bg-[#01A3FF]">
        {/* Left side */}
        <div className="hidden rounded-l-4xl lg:flex w-1/2 bg-cover bg-center relative overflow-hidden ">
          <Image
            src={"/cover.png"}
            alt="Cover"
            height={2400}
            width={2400}
          ></Image>
        </div>

        {/* Right side */}
        <div className="flex w-full lg:w-1/2 items-center sm:rounded-r-4xl justify-center sm:p-6 sm:bg-[#F4F4F4]">
          <div className="w-full max-w-md bg-white shadow-[0px_0px_10px_rgb(0,0,0,0.4)] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-black">SignUp</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-[#01A3FF] text-white py-3 rounded-lg font-semibold cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-200 ease-in-out
                 disabled:bg-[#4cb7f5] disabled:cursor-not-allowed disabled:pointer-events-none"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-bars loading-md"></span>
                ) : (
                  "Register"
                )}
              </button>
            </form>
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
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
