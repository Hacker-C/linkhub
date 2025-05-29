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
  DialogFooter,
  DialogDescription, // Optional: if you want a subtitle
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Bookmark } from "@/actions/generated/client";

// Define Zod schema for validation
const editBookmarkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL format"),
  description: z.string().optional(),
  readingProgress: z.number().min(0).max(100),
});

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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditBookmarkFormValues>({
    resolver: zodResolver(editBookmarkSchema),
    defaultValues: {
      title: bookmark?.title || "",
      url: bookmark?.url || "",
      description: bookmark?.description || "",
      readingProgress: bookmark?.readingProgress || 0,
    },
  });

  // Watch readingProgress for live update of slider label if desired
  const currentProgress = watch("readingProgress", bookmark?.readingProgress || 0);

  React.useEffect(() => {
    if (bookmark) {
      reset({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || "",
        readingProgress: bookmark.readingProgress || 0,
      });
    } else {
      // Reset to default if no bookmark is passed (e.g. for a create mode)
      reset({
        title: "",
        url: "",
        description: "",
        readingProgress: 0,
      });
    }
  }, [bookmark, reset, isOpen]); // Reset form when bookmark changes or dialog opens

  const onSubmit = async (data: EditBookmarkFormValues) => {
    if (!bookmark) return; // Should not happen if used for editing only

    const updatedBookmarkData: Bookmark = {
      ...bookmark,
      ...data,
    }
    console.log(updatedBookmarkData)
    onOpenChange(false); // Close dialog on save
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4"> {/* Changed space-y-6 to space-y-5 for slightly tighter packing */}
          <div className="space-y-1.5"> {/* Group label and input, ensure space for error message */}
            <label htmlFor="title" className="block text-sm font-medium text-foreground">Title</label>
            <Input id="title" {...register("title")} placeholder="Enter bookmark title" />
            {errors.title ? <p className="text-sm text-red-500 pt-0.5">{errors.title.message}</p> : <div className="h-[calc(1.25rem+0.125rem)]"></div>} {/* Adjusted error placeholder height */}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="url" className="block text-sm font-medium text-foreground">URL</label>
            <Input id="url" {...register("url")} placeholder="https://example.com" />
            {errors.url ? <p className="text-sm text-red-500 pt-0.5">{errors.url.message}</p> : <div className="h-[calc(1.25rem+0.125rem)]"></div>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-foreground">Description (Optional)</label>
            <Textarea id="description" {...register("description")} placeholder="A brief description" />
            {errors.description ? <p className="text-sm text-red-500 pt-0.5">{errors.description.message}</p> : <div className="h-[calc(1.25rem+0.125rem)]"></div>}
          </div>
          
          <div className="space-y-2.5"> {/* Increased space for slider label and slider itself */}
            <label htmlFor="readingProgress" className="block text-sm font-medium text-foreground">
              Reading Progress: <span className="font-semibold">{currentProgress}%</span>
            </label>
            <Slider
              id="readingProgress"
              min={0}
              max={100}
              step={1}
              value={[currentProgress]} // Slider expects an array
              onValueChange={(value) => setValue("readingProgress", value[0], { shouldValidate: true })}
              // className="my-2" // Removed my-2, space managed by parent
            />
            {errors.readingProgress ? <p className="text-sm text-red-500 pt-0.5">{errors.readingProgress.message}</p> : <div className="h-[calc(1.25rem+0.125rem)]"></div>}
          </div>

          <DialogFooter className="pt-5"> {/* Increased top padding for footer */}
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
