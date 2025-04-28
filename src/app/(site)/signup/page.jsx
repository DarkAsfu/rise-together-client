"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import signupimg from "../../../../public/signup.jpeg";

const Page = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="grid md:grid-cols-2 items-center w-full max-w-[1200px] gap-8 p-2 md:p-8 border-0 md:border-1 md:border-t rounded-lg shadow-none md:shadow-xl">
                <div className="">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                            <CardDescription>Create your account to get started.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="Enter your full name" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="Enter your email" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" placeholder="Create a password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <Input id="confirm-password" type="password" placeholder="Confirm your password" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-primary text-white">Create Account</Button>
                        </CardFooter>
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
