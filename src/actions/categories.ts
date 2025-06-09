'use server'

import { Category, Prisma } from "@prisma/client";
import CategoryUncheckedCreateInput = Prisma.CategoryUncheckedCreateInput;
import { buildTree, ResponseWithError, withErrorHandle } from "@/lib/utils";
import { getUser } from "@/actions/users";
import { prisma } from "@/db/prisma";

export type CreateCategoryParams = Pick<CategoryUncheckedCreateInput, 'isPublic' | 'name' | 'parentId'>

export type TreeCategory = Category & {
  subCategories: TreeCategory[];
  itemCount: number
  isSubMenuOpen: boolean
};

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

/**
 * Update category
 * @param params
 */
const updateCategoryImpl = async (
  params: Prisma.CategoryUpdateInput
): Promise<ResponseWithError<Category>> => {
  const res = await getUser()
  if (res?.errorMessage || !res?.data?.id) {
    throw new Error(res.errorMessage || 'Unknown error')
  }
  const result = await prisma.category.update({
    where: { id: params.id as string },
    data: params
  })
  return { errorMessage: null, data: result }
}

/**
 * Query categories recursively and efficiently.
 * @param id - Optional. The ID of the category to start from. If not provided, starts from all root categories.
 */
const queryTreeCategoriesImpl = async (): Promise<ResponseWithError<TreeCategory[]>> => {
  const res = await getUser();
  if (res?.errorMessage || !res?.data?.id) {
    throw new Error(res.errorMessage || 'Unknown user');
  }
  const userId = res.data.id;

  // This is the raw SQL query using a recursive CTE.
  // It fetches all descendants of the starting nodes in one go.
  const recursiveQuery = Prisma.sql`
      WITH RECURSIVE category_tree AS (
          -- Base Case: Select the starting categories
          -- Either the specific 'id' provided, or all root categories for the user
          SELECT id,
                 name,
                 parent_id,
                 is_public,
                 created_at,
                 updated_at,
                 user_id,
                 0 as level
          FROM "categories"
          WHERE user_id = ${userId}
            AND categories.parent_id IS NULL

          UNION ALL

          -- Recursive Step: Find all children of the categories found in the previous step
          SELECT c.id,
                 c.name,
                 c.parent_id,
                 c.is_public,
                 c.created_at,
                 c.updated_at,
                 c.user_id,
                 ct.level + 1
          FROM "categories" c
                   JOIN category_tree ct ON c.parent_id = ct.id
          WHERE c.user_id = ${userId} -- Ensure we stay within the user's categories
      )
      SELECT *
      FROM category_tree
      ORDER BY level;
  `;

  // Execute the query
  const flatCategories = await prisma.$queryRaw<TreeCategory[]>(recursiveQuery);

  // Reconstruct the nested tree structure from the flat list
  const categoryTree = buildTree(flatCategories);

  return { errorMessage: null, data: categoryTree };
};


/**
 * Query category
 * @param params
 */
const queryCategoryByIdImpl = async (id: string): Promise<ResponseWithError<TreeCategory>> => {
  const result = await prisma.category.findUnique({
    where: {
      id
    }
  })

  if (!result || !result.isPublic) {
    return { errorMessage: 'Category not found', data: null }
  }

  return { errorMessage: null, data: result as TreeCategory }
}

/**
 * Query category
 * @param params
 */
const queryPublicCategoriesOfUserImpl = async (username: string): Promise<ResponseWithError<TreeCategory[]>> => {
  const { id } = await prisma.user.findFirst({
    where: { username },
    select: { id: true }
  }) || {};
  if (!id) {
    return { errorMessage: 'User not found', data: null }
  }
  const result = await prisma.category.findMany({
    where: {
      userId: id,
      isPublic: true
    }
  })

  if (!result || result.length === 0) {
    return { errorMessage: 'Category not found', data: null }
  }

  return { errorMessage: null, data: result as TreeCategory[] }
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

/* ########## actions for client ########## */

/**
 * Query categories
 * @param params
 */
export async function queryCategories(): Promise<ResponseWithError<TreeCategory[]>> {
  return withErrorHandle(queryTreeCategoriesImpl)()
}

/**
 * Query category
 * @param params
 */
export async function queryCategoryById(id: string): Promise<ResponseWithError<TreeCategory>> {
  return withErrorHandle(queryCategoryByIdImpl)(id)
}

/**
 * Create category
 * @param params
 */
export async function createCategoryAction(params: CreateCategoryParams): Promise<ResponseWithError<Category>> {
  return withErrorHandle(createCategoryImpl)(params)
}

/**
 * Update category
 * @param params
 */
export async function updateCategory(params: Prisma.CategoryUpdateInput): Promise<ResponseWithError<Category>> {
  return withErrorHandle(updateCategoryImpl)(params)
}


/**
 * Delete category
 * @param id category id
 */
export async function deleteCategoryById(id: string): Promise<ResponseWithError<TreeCategory>> {
  return withErrorHandle(deleteCategoryByIdImpl)(id)
}

/**
 * Delete category
 * @param id category id
 */
export async function queryPublicCategoriesOfUser(id: string): Promise<ResponseWithError<TreeCategory[]>> {
  return withErrorHandle(queryPublicCategoriesOfUserImpl)(id)
}
