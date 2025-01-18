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
import {createUser} from '@/actions/users'
import {AppContext} from "@/app/providers/appContext";

export function CreateUserForm() {
    const [open, setOpen] = useState(false)
    const context = useContext(AppContext)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Invite User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <form
                    action={async (formData) => {
                        await createUser(formData)
                        setOpen(false)
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required/>
                    </div>
                    {context?.state?.isInAdminGroup && (
                        <Button type="submit" className="w-full">
                            Invite User
                        </Button>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}

