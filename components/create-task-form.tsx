'use client'

import {useContext, useState} from 'react'
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
import {AppContext} from "@/app/providers/appContext";

type User = {
    id: string
    name: string
    email: string
}

export function CreateTaskForm({users}: { users: User[] }) {
    const [open, setOpen] = useState(false)
    const context = useContext(AppContext)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form
                    action={async (formData) => {
                        await createTask(formData)
                        setOpen(false)
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="name">Task Name</Label>
                        <Input id="name" name="name" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input id="deadline" name="deadline" type="date" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="responsibility">Assign To</Label>
                        <Select name="responsibility" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select user"/>
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {context?.state?.isInAdminGroup && (
                        <Button type="submit" className="w-full">
                            Create Task
                        </Button>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}

