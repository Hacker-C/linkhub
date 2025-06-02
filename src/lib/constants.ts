/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Default category id，all links
 */
export const CATEGORY_DEFAULT_ID = '0'

/**
 * tanstack query stale time
 */
export const REACT_QUERY_STALE_TIME = 24 * 60 * 60 * 1000

/**
 * messages
 */
export const MESSAGES = {
  // business crud
  UPDATE_OPERATION_SUCCESS: 'Update successfully',
  CREATE_OPERATION_SUCCESS: 'Create successfully',
  DELETE_OPERATION_SUCCESS: 'Delete successfully',
  OPERATION_FAILED: 'Operation failed',

  // auth
  LOGIN_SUCCESS: 'Login successfully',
  LOGIN_FAILED: 'Login failed',
  INVALID_CREDENTIALS: 'Invalid email or password',
  LOGOUT_SUCCESS: 'Logout successfully',
  REGISTER_SUCCESS: 'Register successfully',
  REGISTER_FAILED: 'Register failed',
  EMAIL_ALREADY_EXISTS: 'Email already exists',

  // common
  UNKNOWN_ERROR: 'Unknown error',
  UNAUTHORIZED: 'Unauthorized',
  SERVER_ERROR: 'Server error',
  NETWORK_ERROR: 'Network error'
};


const OPERATIONS_CONSTANTS = {
  ADD:'add',
  DELETE:'delete',
  UPDATE: 'update',
  QUERY:'query'
} as const

export type OPERATIONS = typeof OPERATIONS_CONSTANTS[keyof typeof OPERATIONS_CONSTANTS]
