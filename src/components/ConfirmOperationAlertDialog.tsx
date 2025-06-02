import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

interface ConfirmOperationAlertDialogProps {
  open: boolean
  onClose: () => void
  onOpen: (v: boolean) => void
  onOk: () => void
  okText?: string
  confirmTitle?: string
  description?: React.ReactNode
  children?: React.ReactNode
}

export default function ConfirmOperationAlertDialog({
  open,
  onOpen,
  onClose,
  onOk,
  okText = 'Ok',
  confirmTitle = 'Are you absolutely sure ?',
  description = ' This action cannot be undone. This will permanently remove your data from our servers.',
  children
} : ConfirmOperationAlertDialogProps) {

  const handleOpenChange = (isOpen: boolean) => {
    if (!open) {
      // 仅当用户显式关闭（如点击取消按钮）时才关闭
      // 忽略外部点击（open === false 且无显式操作）
      return;
    }
    onOpen(isOpen);
  };

  return (<AlertDialog open={open} onOpenChange={handleOpenChange} >
    <AlertDialogContent className="non-dismissable" onChange={(e) => {
      e.stopPropagation()
    }} onPointerOut={(e) => {
      e.preventDefault()
      e.stopPropagation()
    }}>
      <AlertDialogHeader>
        <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      { children }
      <AlertDialogFooter>
        <AlertDialogCancel onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={(e) => {
          e.stopPropagation()
          onOk()
        }}>{okText}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>)
}
