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
import { useMutation } from "@tanstack/react-query";
import { loginAction } from "@/actions/users";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

const loginSchema = z.object({
  emailOrUsername: z.union([
    z.string().email({ message: 'Invalid email address' }),
    z.string().regex(/^[a-zA-Z0-9_]{3,20}$/, {
      message: 'Username must be 3-20 characters, letters, numbers, or underscores only',
    }),
  ]),
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

  const router = useRouter()
  const { login } = useAuth()

  const loginMutation = useMutation({
    mutationFn: loginAction
  })
  const { isPending, data: result } = loginMutation
  const onSubmit = async (data: LoginFormValues) => {
    const result = await loginMutation.mutateAsync(data)
    if (result.errorMessage) {
      toast.error(result.errorMessage)
    } else {
      toast.success('Login success!')
      login()
      router.push('/admin')
    }
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
            placeholder="Email Or Username"
            {...register("emailOrUsername")}
          />
          {errors.emailOrUsername && (
            <p className="text-sm text-red-500">{errors.emailOrUsername.message}</p>
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
        {result?.errorMessage && <p className="text-destructive text-sm">{result?.errorMessage}</p>}
        <Button type="submit" className="w-full mt-3">
          { isPending
            ? <><Loader2 className="animate-spin" /> Logging in...</>
            : 'Login'
          }
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
