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
import {createUser} from '@/actions/users'
import {useStore} from '@/store'
import {useAuth} from "react-oidc-context";
import {useRouter} from 'next/navigation'
import {Switch} from "@/components/ui/switch";

export function CreateUserForm() {
    const store = useStore()
    const auth = useAuth()
    const router = useRouter()
    const [open, setOpen] = useState(false)

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
                        const result = await createUser(formData, auth.user?.id_token!)
                        setOpen(false)
                        if (result.success) {
                            router.refresh()
                        }
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
                    <div className="flex items-center space-x-2 ">
                        <Label htmlFor="admin">Admin</Label>
                        <Switch id="admin" name="admin"/>
                    </div>
                    {store.userIsAdmin && (
                        <Button disabled={!open} type="submit" className="w-full">
                            Invite User
                        </Button>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}

