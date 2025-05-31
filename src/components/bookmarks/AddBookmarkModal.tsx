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
import { createBookmarkAction, createBookmarkParams } from "@/actions/bookmarks";
import { FetchedWebsiteMetadata } from "@/app/api/fetch-meta/route";
import { usePageParams } from "@/hooks/useCategoryId";
import { toast } from "sonner";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL (e.g., http://example.com)." }),
})

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                           }) => {

  const categoryId = usePageParams('categoryid')

  useEffect(() => {
    if (isOpen) {
      form.reset()
    }
  }, [isOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    }
  })

  const mutation = useMutation({
    mutationFn: async (url: string) => {

      let metadata: FetchedWebsiteMetadata

      // 3. Handle response
      try {
        // 1. Construct API request URL
        const apiUrl = `/api/fetch-meta?url=${encodeURIComponent(url)}`;

        // 2. Make fetch request
        const response = await fetch(apiUrl);
        if (!response.ok) {
          // If the HTTP status code is not 2xx, try to parse the error message
          const errorData = await response.json().catch(() => ({ error: `Request failed, status code: ${response.status}` }));
          throw new Error(errorData.error || `Request failed, status code: ${response.status}`);
        }
        metadata = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        metadata = { title: url, domain: url }
      }


      const { title, description, iconLink, domain, ogImage } = metadata

      const params = {
        url,
        title: title || domain,
        description: description || url,
        faviconUrl: iconLink,
        domainName: domain,
        ogImageUrl: ogImage,
      } as createBookmarkParams

      console.log(params)

      const res = await createBookmarkAction({
        ...params,
        categoryId: categoryId === '0' ? null : categoryId
      })
      return res
    }
  })

  const { isPending, isError, error } = mutation

  async function onSubmit({ url }: z.infer<typeof formSchema>) {
    const res = await mutation.mutateAsync(url)
    if (res.errorMessage) {
      toast.error(res.errorMessage)
    } else {
      toast.success('Add link successfully!');
      handleClose()
    }
  }

  const handleClose = () => {
    // Resetting state is now handled by useEffect when isOpen becomes true,
    // but we can still call onClose to ensure parent state is updated.
    onClose();
  };

  return (<>
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Link</DialogTitle>
          <DialogDescription>
            Fill in the details for your new bookmark.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            {isError && <p className="text-destructive text-sm">{error?.message}</p>}
            <Button
              type="submit"
              disabled={isPending}
              className="mt-1"
            >
              {isPending
                ? <><Loader2 className="animate-spin"/>Submitting query...</>
                : 'Submit Query'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  </>)
};

export default AddBookmarkModal;
