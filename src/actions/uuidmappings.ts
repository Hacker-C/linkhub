import { ResponseWithError, withErrorHandle } from "@/lib/utils";
import { UUIdMapping } from "@prisma/client";
import { prisma } from "@/db/prisma";
import { getPublicSchemaUser, getPublicSchemaUserByUsername, getUser } from "@/actions/users";

/**
 * Query bookmarks
 * @param title
 * @param url
 * @param categoryId
 * @param description
 */
const queryUUIdMappingByShortIdImpl = async (
  { shortId, username }: queryUUIdMappingByShortIdParams
): Promise<ResponseWithError<UUIdMapping>> => {
  let finalUsername = username
  if (!finalUsername) {
    const user = await getUser()
    if (user?.errorMessage || !user.data?.id) {
      throw new Error(user.errorMessage || 'Unknown error')
    }
    const { errorMessage, data: result } = await getPublicSchemaUser(user.data.id)
    if (errorMessage || !result?.username) {
      throw new Error(errorMessage || 'Unknown error')
    }
    finalUsername = result.username
  }
  const res = await getPublicSchemaUserByUsername(finalUsername)
  if (res?.errorMessage || !res?.data?.username) {
    throw new Error(res.errorMessage || 'Unknown error')
  }
  const result = await prisma.uUIdMapping.findFirst({
    where: { shortId, userId: res.data.id! },
  })
  return { errorMessage: null, data: result }
}

export type queryUUIdMappingByShortIdParams = {
  shortId: number
  username: string
}

/**
 * Query bookmarks
 * @param params
 */
export async function queryUUIdMappingByShortId(params: queryUUIdMappingByShortIdParams): Promise<ResponseWithError<UUIdMapping>> {
  return withErrorHandle(queryUUIdMappingByShortIdImpl)(params)
}
