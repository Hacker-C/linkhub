'use server'

import { Category, Prisma } from "@prisma/client";
import CategoryUncheckedCreateInput = Prisma.CategoryUncheckedCreateInput;
import { buildTree, ResponseWithError, withErrorHandle } from "@/lib/utils";
import { getPublicSchemaUserByUsername, getUser } from "@/actions/users";
import { prisma } from "@/db/prisma";

export type CreateCategoryParams = Pick<CategoryUncheckedCreateInput, 'isPublic' | 'name' | 'parentId'>

export type TreeCategory = ICategory & {
  subCategories: TreeCategory[];
  itemCount: number
  isSubMenuOpen: boolean
};

export type ICategory = Category & {
  shortId: string
}

/**
 * Create category
 * @param params
 */
const createCategoryImpl = async (
  params: CreateCategoryParams
): Promise<ResponseWithError<ICategory>> => {
  const res = await getUser()
  if (res?.errorMessage || !res?.data?.id) {
    throw new Error(res.errorMessage || 'Unknown error')
  }
  const result = await new Promise((resolve, reject) => {
    prisma.$transaction(async (tx) => {
      const category = await tx.category.create({
        data: {
          userId: res?.data?.id as string,
          ...params
        }
      })
      const uuidmappingDB = await prisma.uUIdMapping.findFirst({
        where: {
          userId: res.data?.id as string
        },
        orderBy: {
          createdAt: 'desc' // 按创建时间降序排列
        },
      })
      const newShortId = uuidmappingDB ? ++uuidmappingDB.shortId : 1
      const uuidMapping = await tx.uUIdMapping.create({
        data: {
          userId: res?.data?.id as string,
          type: '1',
          shortId: newShortId,
          uuid: category.id,
        }
      })
      return { ...category, shortId: uuidMapping.shortId }
    }).then((result) => {
      resolve(result)
    }).catch((error) => {
      reject(error)
    })
  })
  return { errorMessage: null, data: result as ICategory }
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
          SELECT c.id,
                 c.name,
                 c.parent_id,
                 c.is_public,
                 c.created_at,
                 c.updated_at,
                 c.user_id,
                 u.short_id,
                 0 as level
          FROM categories c
            LEFT JOIN uuidmappings u ON u.uuid = c.id
          WHERE c.user_id = ${userId}
            AND c.parent_id IS NULL

          UNION ALL

          -- Recursive Step: Find all children of the categories found in the previous step
          SELECT c.id,
                 c.name,
                 c.parent_id,
                 c.is_public,
                 c.created_at,
                 c.updated_at,
                 c.user_id,
                 u.short_id,
                 ct.level + 1
          FROM "categories" c
                   JOIN category_tree ct ON c.parent_id = ct.id
                   LEFT JOIN uuidmappings u ON u.uuid = c.id
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

type QueryCategoryByShortIdParams = {
  username: string;
  shortId: number;
}

/**
 * Query category
 * @param params
 */
const queryCategoryByShortIdImpl = async ({ username, shortId }: QueryCategoryByShortIdParams): Promise<ResponseWithError<TreeCategory>> => {
  const userRes = await getPublicSchemaUserByUsername(username)
  if (userRes.errorMessage || !userRes.data) {
    throw new Error(userRes.errorMessage || 'User not found');
  }
  const uuidMapRes = await prisma.uUIdMapping.findFirst({
    select: {
      uuid: true
    },
    where: {
      shortId,
      userId: userRes.data.id
    }
  })
  if (!uuidMapRes) {
    throw new Error('Category not found');
  }
  return queryCategoryByIdImpl(uuidMapRes.uuid);
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
 * Query category by shortId
 * @param params
 */
export async function queryCategoryByShortId(params: QueryCategoryByShortIdParams): Promise<ResponseWithError<TreeCategory>> {
  return withErrorHandle(queryCategoryByShortIdImpl)(params)
}

/**
 * Create category
 * @param params
 */
export async function createCategoryAction(params: CreateCategoryParams): Promise<ResponseWithError<ICategory>> {
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
