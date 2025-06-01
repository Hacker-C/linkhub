"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Bookmark } from "@/actions/generated/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookmark } from "@/actions/bookmarks";
import { toast } from "sonner";
import { CATEGORY_DEFAULT_ID, MESSAGES } from "@/lib/constants";
import { updateBookmarkCacheData } from "@/actions/states/bookmarkState";

const editBookmarkSchema = z.object({
  title: z.string(),
  url: z.string().url({ message: "Please enter a valid URL (e.g., http://example.com)." }),
  ogImageUrl: z
    .string()
    .url({ message: 'Please enter a valid URL (e.g., http://example.com).' })
    .optional()
    .or(z.literal('')),
  description: z.string(),
  readingProgress: z.number().min(0).max(100)
})

type EditBookmarkFormValues = z.infer<typeof editBookmarkSchema>;

interface EditBookmarkModalProps {
  bookmark: Bookmark | null; // Bookmark to edit, or null if dialog is for creating (though current plan is edit only)
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditBookmarkModal({
                                    bookmark,
                                    isOpen,
                                    onOpenChange,
                                  }: EditBookmarkModalProps) {
  const form = useForm<EditBookmarkFormValues>({
    resolver: zodResolver(editBookmarkSchema),
    defaultValues: {
      title: '',
      url: '',
      ogImageUrl: '',
      description: '',
      readingProgress: 0
    }
  })
  const { reset, watch, setValue } = form

  const currentProgress = +watch("readingProgress", +(bookmark?.readingProgress || 0));

  React.useEffect(() => {
    if (bookmark) {
      reset({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || "",
        readingProgress: +(bookmark.readingProgress || 0),
        ogImageUrl: bookmark?.ogImageUrl || ''
      });
    } else {
      reset({
        title: "",
        url: "",
        description: "",
        readingProgress: 0,
      });
    }
  }, [bookmark, reset , isOpen]);

  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateBookmark,
    onSuccess: async (note) => {
      await updateBookmarkCacheData(bookmark?.categoryId ?? CATEGORY_DEFAULT_ID, note, 'update', queryClient)
    }
  })

  const onSubmit = async (data: EditBookmarkFormValues) => {
    if (!bookmark) return

    const res = await mutateAsync({id: bookmark.id, data })
    if (res.errorMessage) {
      toast.error(res.errorMessage)
    } else {
      toast.error(MESSAGES.UPDATE_OPERATION_SUCCESS);
      onOpenChange(false)
    }
  };

  if (!isOpen || !bookmark) {
    return null; // Don't render if not open or no bookmark
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
          <DialogDescription>
            Update the details for your bookmark.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            form.setValue('readingProgress', +form.getValues('readingProgress'))
            form.handleSubmit(onSubmit)();
          }} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a valid URL: https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ogImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Image Url</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a valid URL: https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="readingProgress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reading Progress</FormLabel>
                  <FormControl>
                    <Slider
                      id="readingProgress"
                      {...field}
                      min={0}
                      max={100}
                      step={1}
                      value={[currentProgress]}
                      onValueChange={(value) => setValue("readingProgress", +value[0], { shouldValidate: false })}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className='ml-2'>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
