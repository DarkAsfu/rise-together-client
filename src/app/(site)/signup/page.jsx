"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import signupimg from "../../../../public/signup.jpeg";
import Swal from 'sweetalert2';
import Link from 'next/link';

const Page = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const password = watch("password");

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match!'
            });
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: responseData.message || 'Registration successful!',
                    timer: 2000,
                    showConfirmButton: false
                });
                reset(); // Clear form
            } else {
                const errorData = await response.json();
                console.log(errorData);
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: errorData.message || 'Something went wrong!'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred during registration'
            });
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="grid lg:grid-cols-2 items-center w-full max-w-[1200px] gap-8 p-2 md:p-8 border-0 xl:border-1 xl:border-t rounded-lg shadow-none xl:shadow-xl">
                <div className="">
                    <Card className="w-full border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                            <CardDescription>Create your account to helps other people.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid w-full gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input 
                                            id="name"
                                            placeholder="Enter your full name"
                                            {...register("name", { 
                                                required: "Name is required",
                                                minLength: {
                                                    value: 2,
                                                    message: "Name must be at least 2 characters"
                                                }
                                            })}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                    </div>
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
                                            placeholder="Create a password"
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
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input 
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm your password"
                                            {...register("confirmPassword", { 
                                                required: "Please confirm your password",
                                                validate: value => value === password || "Passwords do not match"
                                            })}
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                                    </div>
                                </div>
                                <CardFooter className="px-0 pt-6">
                                    <Button type="submit" className="w-full bg-primary text-white cursor-pointer">
                                        Create Account
                                    </Button>
                                </CardFooter>
                                <p className='text-center mt-2'>Already have an account? <Link className='text-primary font-semibold' href="/signin">Sign in here</Link></p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <div className="hidden lg:flex w-full items-center justify-self-end">
                    <Image
                        src={signupimg}
                        alt="Sign up illustration"
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
