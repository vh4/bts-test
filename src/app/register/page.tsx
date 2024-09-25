'use client';
import React, { useState } from 'react';
import { Input, Button, Message, useToaster } from 'rsuite'; 
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const toaster = useToaster();
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('http://94.74.86.174:8080/api/register', {
        email,
        username,
        password
      });
      
      toaster.push(<Message type="success">Registration successful! Redirect.....</Message>, { placement: 'topCenter' });
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error); 
      toaster.push(<Message type="error">Registration failed. Please try again.</Message>, { placement: 'topCenter' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center items-center space-y-10 md:space-y-0 md:space-x-16 p-6">
      <div className="md:w-1/3 max-w-sm flex justify-center">
        <Image
          src="/draw2.png"
          alt="Register illustration"
          width={500}
          height={300}
          className="max-w-xs mx-auto"
        />      
      </div>
      <div className="md:w-1/3 max-w-sm bg-white rounded-lg p-8">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-700">Register</h2>
        <Input
          placeholder="Username"
          value={username}
          onChange={(value) => setUsername(value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(value) => setEmail(value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(value) => setPassword(value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Button
          appearance="primary"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded uppercase tracking-wide"
          onClick={handleSubmit}
          loading={loading}
        >
          Register
        </Button>
        <div
          onClick={() => router.push('/')}
          className="mt-4 text-center text-sm text-gray-500 cursor-pointer hover:underline"
        >
          Back to <span className="text-blue-600">Login</span>
        </div>
      </div>
    </section>
  );
};

export default Register;
