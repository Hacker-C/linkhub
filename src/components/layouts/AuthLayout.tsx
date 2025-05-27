import { Card, CardHeader } from "@/components/ui/card";
import React from "react";
import { TypographyH2 } from "@/components/ui/typography";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className='absolute top-5 right-10'>
        <ModeToggle/>
      </div>
      <Card className="w-full max-w-sm py-8">
        <CardHeader>
          <TypographyH2>
            <Link href='/'>
              LinkHub
            </Link>
          </TypographyH2>
        </CardHeader>
        { children }
      </Card>
    </div>
  )
}
