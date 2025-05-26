"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }), // Changed from min(6) to min(1) as per instructions
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
    // Handle login logic here
  };

  return (<AuthLayout>
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        {/* <CardDescription>Enter your credentials to access your account.</CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1"> {/* Adjusted space-y for error message */}
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1"> {/* Adjusted space-y for error message */}
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className='flex flex-col items-start'>
        <Button type="submit" className="w-full mt-3">
          Login
        </Button>
        <div className="w-full flex justify-end mt-2">
          <p>
            Don&#39;t have an account? <Link href='/sign-up' className='underline'>Sign up</Link>
          </p>
        </div>
      </CardFooter>
    </form>
  </AuthLayout>)
}
