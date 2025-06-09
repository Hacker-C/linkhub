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
import { registerAction } from "@/actions/users";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  username: z.string().min(1).max(32),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Path to field where error is shown
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter()

  const registerMutation = useMutation({
    mutationFn: registerAction
  })
  const { isPending, data: registerResult } = registerMutation
  const onSubmit = async (data: SignUpFormValues) => {
    const result = await registerMutation.mutateAsync(data)
    if (result.errorMessage) {
      toast.error(result.errorMessage)
    } else {
      toast.success('Sign up success! A verification email has been sent to your email address.')
      router.push('/login')
    }
  };

  return (<AuthLayout>
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Input
            type="username"
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className='flex flex-col items-start'>
        {registerResult?.errorMessage && <p className="text-destructive text-sm">{registerResult?.errorMessage}</p>}
        <Button type="submit" className="w-full mt-3">
          { isPending
            ? <><Loader2 className="animate-spin" /> Logging in...</>
            : 'Sign Up'
          }
        </Button>
        <div className="w-full flex justify-end mt-2">
          <p>Already have an account? <Link href='/login' className='underline'>Login</Link> </p>
        </div>
      </CardFooter>
    </form>
  </AuthLayout>)
}
