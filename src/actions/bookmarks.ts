'use server'

import { Bookmark, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";
import { ResponseWithError, withErrorHandle } from "@/lib/utils";
import { getUser } from "@/actions/users";

/**
 * Create bookmark
 * @param title
 * @param url
 * @param categoryId
 * @param description
 */
const createBookmarkImpl = async (
  { title, url, categoryId, description, faviconUrl, ogImageUrl, domainName }: createBookmarkParams
): Promise<ResponseWithError<Bookmark>> => {
  const res = await getUser()
  if (res?.errorMessage || !res?.data?.id) {
    throw new Error(res.errorMessage || 'Unknown error')
  }
  const result = await prisma.bookmark.create({
    data: {
      url,
      title,
      description,
      faviconUrl,
      domainName,
      ogImageUrl,
      userId: res.data.id!,
      categoryId,
    }
  })
  return { errorMessage: null, data: result }
}

export type createBookmarkParams =
  Pick<Prisma.BookmarkUncheckedCreateInput, 'title' | 'url' | 'categoryId' |'description' | 'faviconUrl' | 'ogImageUrl' | 'domainName'>

/**
 * Create bookmark
 * @param params
 */
export async function createBookmarkAction(params: createBookmarkParams): Promise<ResponseWithError<Bookmark>> {
  return withErrorHandle(createBookmarkImpl)(params)
}

/**
 * Query bookmarks
 * @param title
 * @param url
 * @param categoryId
 * @param description
 */
const queryBookmarksImpl = async (
  { categoryId, cursor, limit = 10 }: queryBookmarksParams
): Promise<ResponseWithError<{ data: Bookmark[]; nextCursor?: string }>> => {
  const res = await getUser()
  if (res?.errorMessage || !res?.data?.id) {
    throw new Error(res.errorMessage || 'Unknown error')
  }
  let whereCondition = {}
  if (!!categoryId) {
    whereCondition = { userId: res.data.id!, categoryId }
  } else {
    whereCondition = { userId: res.data.id! }
  }
  console.log('whereCondition=', whereCondition)
  const result = await prisma.bookmark.findMany({
    where: whereCondition,
    take: limit,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
  })
  let nextCursor: string | undefined = undefined
  if (result.length === limit) {
    nextCursor = result[limit - 1].id
  }
  return { errorMessage: null, data: result, nextCursor }
}

export type queryBookmarksParams = Partial<Pick<Prisma.BookmarkUncheckedCreateInput, 'categoryId'>> & { cursor?: string, limit?: number }

/**
 * Query bookmarks
 * @param params
 */
export async function queryBookmarks(params: queryBookmarksParams): Promise<ResponseWithError<{ data: Bookmark[]; nextCursor?: string }>> {
  return withErrorHandle(queryBookmarksImpl)(params)
}

/**
 * Query public bookmarks by categoryId
 * @param title
 * @param url
 * @param categoryId
 * @param description
 */
const queryPublicBookmarksByCategoryIdImpl = async (
  { categoryId, cursor, limit = 10 }: queryBookmarksParams
): Promise<ResponseWithError<{ data: Bookmark[]; nextCursor?: string }>> => {
  const result = await prisma.bookmark.findMany({
    where: { categoryId },
    take: limit,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
  })
  let nextCursor: string | undefined = undefined
  if (result.length === limit) {
    nextCursor = result[limit - 1].id
  }
  return { errorMessage: null, data: result, nextCursor }
}

/**
 * Public Query bookmarks by categoryId
 * @param params
 */
export async function queryPublicBookmarksByCategoryId(params: queryBookmarksParams): Promise<ResponseWithError<{ data: Bookmark[]; nextCursor?: string }>> {
  return withErrorHandle(queryPublicBookmarksByCategoryIdImpl)(params)
}

const deleteBookmarkByIdImpl = async (id: string ): Promise<ResponseWithError<Bookmark>> => {
  const result = await prisma.bookmark.delete({
    where: { id }
  })
  return { errorMessage: null, data: result }
}

/**
 * Delete Bookmark ById
 * @param params
 */
export async function deleteBookmarkById(id: string): Promise<ResponseWithError<Bookmark>> {
  return withErrorHandle(deleteBookmarkByIdImpl)(id)
}

export type UpdateBookmarkParams = {
  id: string,
  data: Prisma.BookmarkUpdateInput
}

const updateBookmarkImpl = async ({id, data} : UpdateBookmarkParams): Promise<ResponseWithError<Bookmark>> => {
  const result = await prisma.bookmark.update({
    where: { id },
    data
  })
  return { errorMessage: null, data: result }
}

/**
 * Update Bookmark ById
 * @param params
 */
export async function updateBookmark(params: UpdateBookmarkParams): Promise<ResponseWithError<Bookmark>> {
  return withErrorHandle(updateBookmarkImpl)(params)
}
