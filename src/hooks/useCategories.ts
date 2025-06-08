import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/actions/lib/queryKeys";
import { queryCategories, TreeCategory } from "@/actions/categories";
import { toast } from "sonner";
import { OPERATIONS } from "@/lib/constants";

/**
 * Recursively finds and updates a node in a tree.
 * @param nodes - The array of categories to search through.
 * @param targetCategory - The category with updated data.
 * @returns A new array with the updated node.
 */
const recursiveUpdate = (nodes: TreeCategory[], targetCategory: TreeCategory): TreeCategory[] => {
  return nodes.map(node => {
    // If we found the node, update it and return the new version.
    if (node.id === targetCategory.id) {
      return { ...node, ...targetCategory };
    }
    // If the node has sub-categories, recursively try to update them.
    if (node.subCategories && node.subCategories.length > 0) {
      return { ...node, subCategories: recursiveUpdate(node.subCategories, targetCategory) };
    }
    // Otherwise, return the node as is.
    return node;
  });
};

/**
 * Recursively finds and deletes a node from a tree.
 * @param nodes - The array of categories to search through.
 * @param targetId - The ID of the category to delete.
 * @returns A new array with the specified node removed.
 */
const recursiveDelete = (nodes: TreeCategory[], targetId: string): TreeCategory[] => {
  // Filter out the node at the current level.
  return nodes
    .filter(node => node.id !== targetId)
    .map(node => {
      // For the remaining nodes, recursively process their children.
      if (node.subCategories && node.subCategories.length > 0) {
        return { ...node, subCategories: recursiveDelete(node.subCategories, targetId) };
      }
      return node;
    });
};

/**
 * Recursively finds the parent and adds a new node to its sub-categories.
 * @param nodes - The array of categories to search through.
 * @param newCategory - The new category to add.
 * @returns A new array including the new node.
 */
const recursiveAdd = (nodes: TreeCategory[], newCategory: TreeCategory): TreeCategory[] => {
  // If the new category has no parent, it's a root node.
  if (newCategory.parentId === null || newCategory.parentId === undefined) {
    return [newCategory, ...nodes];
  }

  return nodes.map(node => {
    // If we found the parent, add the new category to its sub-categories.
    if (node.id === newCategory.parentId) {
      const subCategories = node.subCategories ? [newCategory, ...node.subCategories] : [newCategory];
      return { ...node, subCategories };
    }
    // If the node has sub-categories, recursively search for the parent there.
    if (node.subCategories && node.subCategories.length > 0) {
      return { ...node, subCategories: recursiveAdd(node.subCategories, newCategory) };
    }
    return node;
  });
};

function findCategoryRecursive(items: TreeCategory[], targetId: string): TreeCategory | undefined {
  for (const item of items) {
    if (item.id === targetId) {
      return item;
    }
    if (item.subCategories && item.subCategories.length > 0) {
      const foundInChildren = findCategoryRecursive(item.subCategories, targetId);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  return undefined;
}

export const operateCategoryCacheData = (queryClient: QueryClient) => {
  return (targetCategory: TreeCategory, op: OPERATIONS | 'active') => {
    if (op === 'query') {
      const categories = queryClient.getQueryData(queryKeys.queryCategories()) as TreeCategory[];
      if (!categories) {
        return null;
      }
      return findCategoryRecursive(categories, targetCategory.id);
    }
    queryClient.setQueryData<TreeCategory[]>(queryKeys.queryCategories(), (oldData) => {
      // If there's no old data, handle it gracefully.
      // For 'add', we can start a new array. For others, we can't do anything.
      if (!oldData) {
        return op === 'add' ? [targetCategory] : [];
      }

      switch (op) {
        case 'update': {
          // Use the recursive update function
          return recursiveUpdate(oldData, targetCategory);
        }
        case 'add': {
          // Use the recursive add function
          return recursiveAdd(oldData, targetCategory);
        }
        case 'delete': {
          // Use the recursive delete function
          // Note: We only need the ID for deletion.
          return recursiveDelete(oldData, targetCategory.id);
        }
        case 'active': {
          return recursiveUpdate(oldData, { ...targetCategory, isSubMenuOpen: !targetCategory.isSubMenuOpen});
        }
        default: {
          return oldData;
        }
      }
    });
  };
};


/**
 * Get all categories
 */
export const useCategories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: queryKeys.queryCategories(),
    queryFn: async () => {
      const res = await queryCategories()
      if (res.errorMessage || !res.data) {
        toast.error(res.errorMessage)
      }
      return res.data
    },
  })

  const queryClient = useQueryClient()
  const invalidateCategories = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.queryCategories(),
    })
  }

  // do some operations on cache data
  const doOperationsOnCategoryCacheData = operateCategoryCacheData(queryClient)

  return {
    categories,
    isLoading,
    invalidateCategories,
    doOperationsOnCategoryCacheData
  }
}
