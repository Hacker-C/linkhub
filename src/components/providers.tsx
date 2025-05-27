'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
