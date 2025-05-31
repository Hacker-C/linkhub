"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { AuthButtons } from './AuthButtons';
import { UserNav } from './UserNav';
import { Menu, X, PlusCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { useMutation } from "@tanstack/react-query";
import { logoutAction } from "@/actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import AddBookmarkModal from "@/components/bookmarks/AddBookmarkModal";

export function Header({
                         isLoggedIn,
                       }: {
  isLoggedIn: boolean;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddBookmarkModalOpen, setIsAddBookmarkModalOpen] = useState(false); // State for AddBookmarkModal
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

  const openAddBookmarkModal = () => setIsAddBookmarkModalOpen(true);
  const closeAddBookmarkModal = () => setIsAddBookmarkModalOpen(false);

  return (
    <> {/* Fragment to wrap header and modal */}
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
              <div className="ml-4 flex items-center md:ml-6 space-x-2">
                {isLoggedIn ? (
                  <UserNav onLogoutClick={onLogout} userName="Test User" />
                ) : (
                  <AuthButtons onLoginClick={onLogin} onRegisterClick={onRegister} className="space-x-2" />
                )}
                <div className='ml-2'> {/* This div might cause double spacing if UserNav/AuthButtons also have ml. Adjusted parent to space-x-2 */}
                  <ModeToggle />
                </div>
              </div>
            </div>

            {/* Mobile Navigation Trigger */}
            <div className="-mr-2 flex md:hidden">
              <ModeToggle />
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open main menu">
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
                        <Button variant="ghost" size="icon" aria-label="Close menu">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>

                    {isLoggedIn ? (
                      <div className="space-y-3 border-t border-border pt-4">
                        <div className="flex items-center px-1 mb-2">
                          <UserNav onLogoutClick={() => { onLogout(); setIsMobileMenuOpen(false);}} userName="Test User" />
                          <div className="ml-3">
                            <div className="text-base font-medium text-foreground">Test User</div>
                            <div className="text-sm font-medium text-muted-foreground">user@example.com</div>
                          </div>
                        </div>
                        {/* Add IBookmark Button for Mobile */}
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            openAddBookmarkModal();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <PlusCircle className="h-5 w-5 mr-3" />
                          Add Bookmark
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>My Account</Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => { onLogout(); setIsMobileMenuOpen(false);}}>Logout</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" onClick={() => { onLogin(); setIsMobileMenuOpen(false);}}>Login</Button>
                        <Button className="w-full" onClick={() => { onRegister(); setIsMobileMenuOpen(false);}}>Sign Up</Button>
                      </div>
                    )}

                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <AddBookmarkModal
        isOpen={isAddBookmarkModalOpen}
        onClose={closeAddBookmarkModal}
      />
    </>
  );
}