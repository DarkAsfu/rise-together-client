"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import signinimg from "../../../../../public/signin.png";
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';


const Page = () => {
    const router = useRouter();
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await login(data.email, data.password);
            
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.message || 'Login successful!',
                timer: 2000,
                showConfirmButton: false
            });
            
            reset();
            router.push('/');
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.message || 'Invalid credentials!'
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="grid lg:grid-cols-2 items-center w-full max-w-[1200px] gap-8 px-2 md:px-8 border-0 xl:border-1 xl:border-t rounded-lg shadow-none xl:shadow-xl">
                <div className="">
                    <Card className="w-full border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                            <CardDescription>Welcome back! Please login to your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid w-full gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input 
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            {...register("email", { 
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input 
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            {...register("password", { 
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters"
                                                }
                                            })}
                                        />
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                                    </div>
                                </div>
                                <CardFooter className="px-0 pt-6">
                                    <Button type="submit" className="w-full bg-primary text-white cursor-pointer">
                                        Sign In
                                    </Button>
                                </CardFooter>
                                <p className='text-center mt-2'>Don't have an account? <Link className='text-primary font-semibold' href="/auth/signup">Sign up here</Link></p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <div className="hidden lg:flex w-full items-center justify-self-end">
                    <Image
                        src={signinimg}
                        alt="Sign in illustration"
                        width="100%"
                        height="40%"
                        className="object-cover w-full rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default Page;