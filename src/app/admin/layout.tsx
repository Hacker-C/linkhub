"use client"

import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { Sidebar, useSidebar } from "@/components/Sidebar";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const { open } = useSidebar()

  return (
    <>
      <Header/>
      <div className="flex h-[calc(100vh-4rem)]"> {/* Adjust height for sticky nav */}
        {/* Desktop Sidebar */}
        <div className={cn('sidebar-hidden transition-all duration-300', open ? '' : '-ml-64')}>
          <Sidebar/>
        </div>
        {children}
      </div>
    </>
  )
}
