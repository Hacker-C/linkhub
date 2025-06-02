'use server'

import { prisma } from '@/db/prisma'
import { ResponseWithError, handleError, withErrorHandle } from '@/lib/utils'
import { AuthTokenResponsePassword, User, AuthError, AuthResponse } from '@supabase/supabase-js'
import { createClient } from "@/actions/auth/server";
import { User as PublicSchemaUserFromPrisma } from '@/actions/generated/client'
import { validateEmail } from "@/lib/validators";

// Authentication action implementations
const loginImpl = async (client: SupabaseClient, emailOrUsername: string, password: string): Promise<ResponseWithError<AuthTokenResponsePassword['data']>> => {
  let email = emailOrUsername
  if (validateEmail(emailOrUsername).isNotValid) {
    const user = await prisma.user.findFirst({
      where: { username: emailOrUsername },
    })
    if (!user) {
      throw new Error('Could not find user with the username')
    }
    email = user.email
  }
  const { error, data } = await client.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return { errorMessage: null, data: data as unknown as AuthTokenResponsePassword['data'] }
}

const registerImpl = async (
  client: SupabaseClient,
  username: string,
  email: string,
  password: string
): Promise<ResponseWithError<AuthResponse>> => {
  const { error, data } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'http://localhost:3001/login', // Email confirm redirect URL
    },
  })
  if (error) throw error

  const userId = data.user?.id
  if (!userId) throw new Error('User sign up error!')
  await prisma.user.create({
    data: {
      id: userId,
      username,
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

const deleteUserImpl = async (client: SupabaseClient): Promise<ResponseWithError<{error: AuthError}>> => {
  // 1. confirm status
  const { errorMessage, data } = await getUser()
  if (errorMessage || !data?.id) throw errorMessage
  const userId = data.id
  if (!userId) throw new Error('User sign up error!')

  // 2. delete supabase auth users data
  const { error } = await client.rpc('delete_user');
  if (error) {
    throw error
  }
  // 3. delete prisma public users data
  await prisma.user.delete({
    where: { id: userId }
  })
  // 4. logout
  await logoutAction()

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
  emailOrUsername: string;
  password: string;
}

/**
 * Login action - authenticates a user with email and password
 * @param params - Object containing email and password
 * @returns Promise with error message or null if successful
 */
export async function loginAction(params: LoginParams): Promise<ResponseWithError<AuthTokenResponsePassword['data']>> {
  const { emailOrUsername, password } = params
  return withErrorHandling(loginImpl)(emailOrUsername, password)
}

/**
 * Register action - creates a new user account
 * @param params - Object containing email and password
 * @returns Promise with error message or null if successful
 */
export async function registerAction(params: {
  username: string
  email: string
  password: string
}): Promise<ResponseWithError<AuthResponse>> {
  const { username, email, password } = params
  return withErrorHandling(registerImpl)(username, email, password)
}

/**
 * Logout action - signs out the current user
 * @returns Promise with error message or null if successful
 */
export async function logoutAction(): Promise<ResponseWithError<{error: AuthError}>> {
  return withErrorHandling(logoutImpl)()
}

/**
 * Delete action - Delete the current user
 * @returns Promise with error message or null if successful
 */
export async function deleteUserAction(): Promise<ResponseWithError<{error: AuthError}>> {
  return withErrorHandling(deleteUserImpl)()
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
const getSessionImpl = async (client: SupabaseClient): Promise<ResponseWithError<PublicSchemaUser>> => {
  const { data, error } = await client.auth.getSession()
  if (error || !data.session) {
    return { errorMessage: error?.message || 'Auth error' }
  }
  
  const res = await getPublicSchemaUser(data.session.user.id)
  if (res.errorMessage || !res.data) {
    throw new AuthError('Could not get user data from pulic schema')
  }

  return { errorMessage: null, data: res.data }
}

/**
 * Get the current authenticated user
 * @returns The user object or null if not authenticated or error occurs
 */
export async function getSession() {
  return withErrorHandling(getSessionImpl)()
}

const getPublicSchemaUserImpl = async (userId: string): Promise<ResponseWithError<PublicSchemaUser>> => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  })
  if (!user) {
    throw new Error('User not found!')
  }
  return { errorMessage: null, data: user }
}

export type PublicSchemaUser = PublicSchemaUserFromPrisma

/**
 * Get the current authenticated user
 * @returns The user object or null if not authenticated or error occurs
 */
export async function getPublicSchemaUser(userId: string) {
  return withErrorHandle(getPublicSchemaUserImpl)(userId)
}

// /**
//  * Authentication verify action implementations
//  * @param client
//  * @param params
//  */
// const verifySignUpOtpImpl = async (client: SupabaseClient, token : string): Promise<ResponseWithError<AuthTokenResponsePassword['data']>> => {
//   const { error, data } = await client.auth.verifyOtp({ token_hash: token, type: 'signup' });
//   if (error) throw error
//   return { errorMessage: null, data: data as unknown as AuthTokenResponsePassword['data'] }
// }
//
// /**
//  * Logout action - signs out the current user
//  * @returns Promise with error message or null if successful
//  */
// export async function verifySignUpOtpAction(token : string): Promise<ResponseWithError<AuthTokenResponsePassword['data']>> {
//   return withErrorHandling(verifySignUpOtpImpl)(token)
// }
