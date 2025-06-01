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
  UNKNOWN_ERROR: 'Unknown error', // 未知错误
  UNAUTHORIZED: 'Unauthorized', // 未授权
  SERVER_ERROR: 'Server error', // 服务器错误
  NETWORK_ERROR: 'Network error', // 网络错误
};
