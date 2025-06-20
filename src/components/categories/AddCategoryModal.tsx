"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { createCategoryAction, TreeCategory } from "@/actions/categories";
import { toast } from "sonner";
import { usePageParams } from "@/hooks/usePageParams";
import { CATEGORY_DEFAULT_ID } from "@/lib/constants";
import { useCategories } from "@/hooks/useCategories";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCreateSubCategory?: boolean; // Whether this modal is for creating a sub-category
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  isPublic: z.boolean(), // Whether public, defaults to false
});

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
 isOpen,
 onClose,
  isCreateSubCategory = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isPublic: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const mutation = useMutation({
    mutationFn: createCategoryAction,
  });

  const { isPending, isError, error } = mutation;

  const categoryId = usePageParams('categoryid')
  const { doOperationsOnCategoryCacheData } = useCategories()
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const params = {
      ...values,
      parentId: isCreateSubCategory && (categoryId !== CATEGORY_DEFAULT_ID) ? categoryId : null,
    }
    const res = await mutation.mutateAsync(params);
    if (res.errorMessage) {
      toast.error(res.errorMessage)
    } else {
      toast.success('Add category successfully!');
      const category = res.data as TreeCategory
      doOperationsOnCategoryCacheData(category, 'add')
      doOperationsOnCategoryCacheData(category, 'active')
      onClose();
    }
  }

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Fill in the details for your new category.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Category Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Public</FormLabel>
                    <FormDescription>
                      Make this category visible to everyone.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isError && <p className="text-destructive text-sm">{error?.message}</p>}
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? <><Loader2 className="animate-spin" /> Submitting...</>
                : 'Submit'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;

// Helper component for FormDescription
function FormDescription({ children }: { children?: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
