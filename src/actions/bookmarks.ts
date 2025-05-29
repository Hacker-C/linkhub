'use server'

import { Bookmark, Prisma } from "@/actions/generated/client";
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
  { title, url, categoryId, description }: createBookmarkParams
): Promise<ResponseWithError<Bookmark>> => {
  const res = await getUser()
  if (res?.errorMessage || !res?.data?.id) {
    throw new Error(res.errorMessage || 'Unknown error')
  }
  const result = await prisma.bookmark.create({
    data: {
      userId: res.data.id!,
      categoryId,
      title,
      url,
      description
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
  { categoryId }: queryBookmarksParams
): Promise<ResponseWithError<Bookmark[]>> => {
  const res = await getUser()
  if (res?.errorMessage || !res?.data?.id) {
    throw new Error(res.errorMessage || 'Unknown error')
  }
  const result = await prisma.bookmark.findMany({
    where: {
      id: res.data.id!,
      categoryId: categoryId
    }
  })
  return { errorMessage: null, data: result }
}

export type queryBookmarksParams = Partial<Pick<Prisma.BookmarkUncheckedCreateInput, 'categoryId'>>

/**
 * Query bookmarks
 * @param params
 */
export async function queryBookmarks(params: queryBookmarksParams): Promise<ResponseWithError<Bookmark[]>> {
  return withErrorHandle(queryBookmarksImpl)(params)
}
