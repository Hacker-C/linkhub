import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Share, SquareArrowOutUpRight } from "lucide-react";
import ConfirmOperationAlertDialog from "@/components/ConfirmOperationAlertDialog";
import React, { useState } from "react";
import { TreeCategory } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";

type ShareCategoriesProps = {
  category?: TreeCategory
  variant: 'text' | 'icon'
}

export function ShareCategories({category, variant} : ShareCategoriesProps) {
  // Control Share operation
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const onShareMenuItemClick = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    setShareDialogOpen(true)
  }
  const { shortId } = category || {}
  const { user } = useAuth()
  const url = `/share/${user?.username}/${shortId}`
  return (
    <>
      {
        new Map<ShareCategoriesProps['variant'], React.ReactNode>()
          .set('text',  <div onClick={onShareMenuItemClick} className='w-full'>Share</div>)
          .set('icon', <Button variant='ghost' onClick={onShareMenuItemClick}><Share className='w-full'>Share</Share></Button>)
          .get(variant)
      }
      <ConfirmOperationAlertDialog
        open={shareDialogOpen}
        onOpen={setShareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        onOk={async () => {
          await navigator.clipboard.writeText(url)
          toast.success("Copied!");
        }}
        confirmTitle={'You are sharing the links in the category'}
        description={'Once you share the public category, everyone can see your links.'}
        okText={'Copy url'}
      >
        <div className='relative flex items-center'>
          <Input value={url} readOnly className='pr-10'/>
          <SquareArrowOutUpRight
            className="h-4 w-4 text-muted-foreground absolute right-3 flex items-center cursor-pointer"
            onClick={() => {
              window.open(url)
            }}
          />
        </div>
      </ConfirmOperationAlertDialog>
    </>
  )
}