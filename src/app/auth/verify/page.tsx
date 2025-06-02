// 'use client';
//
// import { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { verifySignUpOtpAction } from "@/actions/users";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
//
// // 定义可能的验证状态
// type VerificationState = 'LOADING' | 'SUCCESS' | 'ERROR';
//
// export default function VerifyEmailPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [state, setState] = useState<VerificationState>('LOADING');
//   const [message, setMessage] = useState<string>('');
//
//   // 初始化 Supabase 客户端
//
//   useEffect(() => {
//     async function verifyEmail() {
//       /**
//        * https://mrzcufacktldiitpfpqe.supabase.co/auth/v1/verify
//        *       ?token=pkce_171672f211b1b2aa2684fc4c38a4252b3ce2c1a926752025c9698754
//        *       &type=signup
//        *       &redirect_to=http://localhost:3000
//        */
//       const token = searchParams.get('token');
//       const type = searchParams.get('type');
//       const redirectTo = '/login'
//
//       if (!token || type !== 'signup') {
//         setState('ERROR');
//         setMessage('Invalid or missing verification token');
//         return;
//       }
//
//       try {
//         // 使用令牌验证邮箱
//         const { errorMessage } = await verifySignUpOtpAction(token)
//
//         if (errorMessage) {
//           setState('ERROR');
//           setMessage(errorMessage || 'Email verification error');
//           return;
//         }
//
//         setState('SUCCESS');
//         setMessage('Email verification success, redirecting...')
//         // 短暂延迟后重定向到指定页面
//         setTimeout(() => {
//           router.push(redirectTo);
//         }, 2000);
//       } catch (err) {
//         setState('ERROR');
//         setMessage('Email verification error');
//       }
//     }
//
//     verifyEmail();
//   }, [searchParams, router]);
//
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-muted px-4">
//       <Card className="w-full max-w-md shadow-xl">
//         <CardHeader>
//           {state === 'LOADING' && <CardTitle className="text-center text-lg">Verifying your email...</CardTitle>}
//           {state === 'SUCCESS' && <CardTitle className="text-center text-lg text-green-600">Success!</CardTitle>}
//           {state === 'ERROR' && <CardTitle className="text-center text-lg text-red-600">Error</CardTitle>}
//         </CardHeader>
//         <CardContent className="space-y-4 text-center">
//           <p className="text-sm text-muted-foreground">{message}</p>
//
//           {state === 'ERROR' && (
//             <Button variant="outline" onClick={() => router.push('/sign-up')}>
//               Return to Sign Up
//             </Button>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }