'use client'

import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {createTask} from '@/actions/tasks'
import {useStore} from "@/store";
import {User} from "@/types";
import {useAuth} from "react-oidc-context";
import {useRouter} from 'next/navigation'

export function CreateTaskForm({users}: { users: User[] }) {
    const store = useStore()
    const auth = useAuth()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" aria-describedby="Create new task">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form
                    action={async (formData) => {
                        setLoading(true)
                        const result = await createTask(formData, auth.user?.id_token!)
                        setOpen(false)
                        setLoading(false)
                        if (result.success) {
                            router.refresh()
                        }
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="name">Task Name</Label>
                        <Input id="name" name="name" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" aria-describedby="description" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input id="deadline" name="deadline" type="datetime-local" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="responsibility">Assign To</Label>
                        <Select name="responsibility" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select user"/>
                            </SelectTrigger>
                            <SelectContent>
                                {users && users.map((user, idx) => (
                                    <SelectItem key={idx} value={user.email}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {store.userIsAdmin && (
                        <Button disabled={loading} type="submit" className="w-full">
                            Create Task
                        </Button>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}

