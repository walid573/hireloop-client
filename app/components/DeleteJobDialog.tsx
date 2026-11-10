'use client'
import { useState } from "react"
import { Trash2Icon } from "lucide-react"
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import type { JobRow } from "@/lib/job-types"
import { deleteJob } from "@/lib/actions/jobs"
import { toast } from "@/components/ui/toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeleteJobDialog({ job }: { job: JobRow }) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    
    const handleDelete = async () => {
        const res = await deleteJob(job._id)
        console.log('deleting ', job._id, res)
        if (res.deletedCount) {
            setOpen(false);
            toast.add({
                title: "Job deleted",
                description: "The job has been permanently deleted.",
            })
            router.refresh()
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                render={<Button variant="destructive"><Trash2Icon /></Button>}
            />
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete job?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this job. View{" "}
                        <a href="#">Settings</a> delete any related data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} variant="destructive">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}