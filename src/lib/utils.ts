import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleError<D>(error: unknown): ResponseWithError<D> {
  if (error instanceof Error) {
    return { errorMessage: error.message || 'Unknown error', data: null }
  }
  return { errorMessage: 'Unknown error', data: null }
}

// Define the error response type
export type ResponseWithError<D> = { errorMessage: string | null, data?: D | null }

/**
 * Higher-order function to handle data actions with error handling
 * @param actionFn The authentication action function to execute
 * @returns A function that executes the action and handles errors
 */
export const withErrorHandle = <T, D>(actionFn: (...args: T[]) => Promise<ResponseWithError<D>>) => {
  return async (...args: T[]): Promise<ResponseWithError<D>> => {
    try {
      const result = await actionFn(...args)
      return result
    } catch (error) {
      return handleError(error)
    }
  }
}


