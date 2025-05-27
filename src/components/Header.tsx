"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { AuthButtons } from './AuthButtons';
import { UserNav } from './UserNav';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { useMutation } from "@tanstack/react-query";
import { logoutAction } from "@/actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export function Header({
                         isLoggedIn,
                       }: {
  isLoggedIn: boolean;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter()
  const { logout } = useAuth()

  const logoutMutation = useMutation({
    mutationFn: logoutAction
  })

  const onLogout = () => {
    logoutMutation.mutateAsync().then(res => {
      if (res.errorMessage) {
        toast.error(res.errorMessage)
      } else {
        logout()
        router.replace('/login')
      }
    })
  }

  const onLogin = () => {
    router.push('/login')
  }

  const onRegister = () => {
    router.push('/sign-up')
  }

  return (
    <header className="bg-card shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">LinkHub</span>
            </Link>
          </div>


          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isLoggedIn ? (
                <UserNav onLogoutClick={onLogout} userName="测试用户" />
              ) : (
                <AuthButtons onLoginClick={onLogin} onRegisterClick={onRegister} className="space-x-2" />
              )}
              <div className='ml-2'>
                <ModeToggle />
              </div>
            </div>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="-mr-2 flex md:hidden">
            <ModeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="打开主菜单">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] sm:w-[300px] p-0">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="text-xl font-bold text-primary">LinkHub</span>
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" aria-label="关闭菜单">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {isLoggedIn ? (
                    <div className="space-y-3 border-t border-border pt-4">
                      <div className="flex items-center px-1 mb-2">
                        <UserNav onLogoutClick={() => { onLogout(); setIsMobileMenuOpen(false);}} userName="测试用户" />
                        <div className="ml-3">
                          <div className="text-base font-medium text-foreground">测试用户</div>
                          <div className="text-sm font-medium text-muted-foreground">user@example.com</div>
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>我的账户</Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => { onLogout(); setIsMobileMenuOpen(false);}}>退出登录</Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" onClick={() => { onLogin(); setIsMobileMenuOpen(false);}}>登录</Button>
                      <Button className="w-full" onClick={() => { onRegister(); setIsMobileMenuOpen(false);}}>注册</Button>
                    </div>
                  )}

                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}