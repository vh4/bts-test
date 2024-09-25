'use client'
import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Notification, toaster } from 'rsuite'; // Import React Suite's notification

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Handle login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      username,
      password
    })
    
    // Call NextAuth's signIn method with the credentials
    const res = await signIn('credentials', {
      username,
      password,
      redirect: false, // Prevent redirect
    });

    if (res?.error) {
      // Show error notification if login fails
      toaster.push(
        <Notification type="error" header="Login Failed" duration={5000} className='min-w-[400px] py-2'>
          {res.error}
        </Notification>,
        { placement: 'topCenter' }
      );
    } else if (res?.ok) {
      // Show success notification and redirect if login is successful
      toaster.push(
        <Notification type="success" header="Login Successful" duration={5000} className='min-w-[400px] py-2'>
          Redirecting to dashboard... 
        </Notification>,
        { placement: 'topCenter' }
      );
      router.push('/dashboard'); // Redirect to dashboard
    }
  };

  return (
    <>
      <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
        <div className="md:w-1/3 max-w-sm">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Sample image" />
        </div>
        <div className="md:w-1/3 max-w-sm">
          <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold text-slate-500">Or</p>
          </div>
          {/* Login form */}
          <form onSubmit={handleSubmit}>
            <input
              className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-4 flex justify-between font-semibold text-sm">
            </div>
            <div className="text-center md:text-left">
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
          <div onClick={() => router.push('/register')} className="cursor-pointer mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Don't have an account? <a className="text-red-600 hover:underline hover:underline-offset-4">Register</a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
