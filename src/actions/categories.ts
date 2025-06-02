'use server'

import { Category, Prisma } from "@/actions/generated/client";
import CategoryUncheckedCreateInput = Prisma.CategoryUncheckedCreateInput;
import { ResponseWithError, withErrorHandle } from "@/lib/utils";
import { getUser } from "@/actions/users";
import { prisma } from "@/db/prisma";


/**
 * Create category
 * @param params
 */
const createCategoryImpl = async (
  params: CreateCategoryParams
): Promise<ResponseWithError<Category>> => {
  const res = await getUser()
  if (res?.errorMessage || !res?.data?.id) {
    throw new Error(res.errorMessage || 'Unknown error')
  }
  const result = await prisma.category.create({
    data: {
      userId: res.data.id!,
      ...params
    }
  })
  return { errorMessage: null, data: result }
}

export type CreateCategoryParams = Pick<CategoryUncheckedCreateInput, 'isPublic' | 'name' | 'parentId'>

/**
 * Create category
 * @param params
 */
export async function createCategoryAction(params: CreateCategoryParams): Promise<ResponseWithError<Category>> {
  return withErrorHandle(createCategoryImpl)(params)
}

export type TreeCategory = Category & {
  subCategories: TreeCategory[];
  itemCount: number
};

/**
 * Query categories
 * @param params
 */
const queryCategoriesImpl = async (id? : string): Promise<ResponseWithError<TreeCategory[]>> => {
  const res = await getUser()
  if (res?.errorMessage || !res?.data?.id) {
    throw new Error(res.errorMessage || 'Unknown error')
  }
  const userId = res.data.id!; // 确保 userId 存在

  const whereClause = {
    userId: userId, // 直接使用 userId 字段
  } as { id: string, userId: string }

  if (id) {
    whereClause.id = id;
  }

  console.log('whereClause=', whereClause);

  const result = await prisma.category.findMany({
    where: whereClause,
  });
  return { errorMessage: null, data: result as TreeCategory[] }
}

/**
 * Query categories
 * @param params
 */
export async function queryCategories(id?: string): Promise<ResponseWithError<TreeCategory[]>> {
  return withErrorHandle(queryCategoriesImpl)(id)
}

/**
 * Query category
 * @param params
 */
const queryCategoryImpl = async (id: string): Promise<ResponseWithError<TreeCategory>> => {
  const result = await prisma.category.findUnique({
    where: {
      id
    }
  })
  return { errorMessage: null, data: result as TreeCategory }
}

/**
 * Query category
 * @param params
 */
export async function queryCategory(id: string): Promise<ResponseWithError<TreeCategory>> {
  return withErrorHandle(queryCategoryImpl)(id)
}

/**
 * Delete category
 * @param params
 */
const deleteCategoryByIdImpl = async (id: string): Promise<ResponseWithError<TreeCategory>> => {
  const result = await prisma.category.delete({
    where: { id }
  })
  return { errorMessage: null, data: result as TreeCategory }
}

/**
 * Delete category
 * @param id category id
 */
export async function deleteCategoryById(id: string): Promise<ResponseWithError<TreeCategory>> {
  return withErrorHandle(deleteCategoryByIdImpl)(id)
}
