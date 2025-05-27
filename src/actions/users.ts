'use server'

import { prisma } from '@/db/prisma'
import { ResponseWithError, handleError } from '@/lib/utils'
import { AuthTokenResponsePassword, User, AuthError, AuthResponse, Session } from '@supabase/supabase-js'
import { createClient } from "@/actions/auth/server";

// Authentication action implementations
const loginImpl = async (client: SupabaseClient, email: string, password: string): Promise<ResponseWithError<AuthTokenResponsePassword['data']>> => {
  const { error, data } = await client.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return { errorMessage: null, data: data as unknown as AuthTokenResponsePassword['data'] }
}

const registerImpl = async (client: SupabaseClient, email: string, password: string): Promise<ResponseWithError<AuthResponse>> => {
  const { error, data } = await client.auth.signUp({
    email,
    password
  })
  if (error) throw error

  const userId = data.user?.id
  if (!userId) throw new Error('User sign up error!')
  await prisma.user.create({
    data: {
      id: userId,
      email
    }
  })

  return { errorMessage: null }
}

const logoutImpl = async (client: SupabaseClient): Promise<ResponseWithError<{error: AuthError}>> => {
  const { error } = await client.auth.signOut()
  if (error) throw error
  return { errorMessage: null }
}

// Define the client type
type SupabaseClient = Awaited<ReturnType<typeof createClient>>

/**
 * Higher-order function to handle authentication actions with error handling
 * @param actionFn The authentication action function to execute
 * @returns A function that executes the action and handles errors
 */
const withErrorHandling = <T, D>(actionFn: (client: SupabaseClient, ...args: T[]) => Promise<ResponseWithError<D>>) => {
  return async (...args: T[]): Promise<ResponseWithError<D>> => {
    try {
      const client = await createClient()
      const result = await actionFn(client, ...args)
      return result
    } catch (error) {
      return handleError(error)
    }
  }
}

export interface LoginParams {
  email: string;
  password: string;
}

/**
 * Login action - authenticates a user with email and password
 * @param params - Object containing email and password
 * @returns Promise with error message or null if successful
 */
export async function loginAction(params: LoginParams): Promise<ResponseWithError<AuthTokenResponsePassword['data']>> {
  const { email, password } = params
  return withErrorHandling(loginImpl)(email, password)
}

/**
 * Register action - creates a new user account
 * @param params - Object containing email and password
 * @returns Promise with error message or null if successful
 */
export async function registerAction(params: {
  email: string
  password: string
}): Promise<ResponseWithError<AuthResponse>> {
  const { email, password } = params
  return withErrorHandling(registerImpl)(email, password)
}

/**
 * Logout action - signs out the current user
 * @returns Promise with error message or null if successful
 */
export async function logoutAction(): Promise<ResponseWithError<{error: AuthError}>> {
  return withErrorHandling(logoutImpl)()
}

// Client operation implementations
const getUserImpl = async (client: SupabaseClient): Promise<ResponseWithError<User>> => {
  const { data, error } = await client.auth.getUser()
  if (error) {
    console.log('getUser error=', error)
    return { errorMessage: error.message }
  }
  return { errorMessage: null, data: data.user }
}

/**
 * Get the current authenticated user
 * @returns The user object or null if not authenticated or error occurs
 */
export async function getUser() {
  return withErrorHandling(getUserImpl)()
}

// Client operation implementations
const getSessionImpl = async (client: SupabaseClient): Promise<ResponseWithError<Session>> => {
  const { data, error } = await client.auth.getSession()
  if (error) {
    return { errorMessage: error.message }
  }
  return { errorMessage: null, data: data.session }
}

/**
 * Get the current authenticated user
 * @returns The user object or null if not authenticated or error occurs
 */
export async function getSession() {
  return withErrorHandling(getSessionImpl)()
}