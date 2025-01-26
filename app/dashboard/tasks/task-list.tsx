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
import {Textarea} from '@/components/ui/textarea'
import {Task, User} from '@/types'
import {markTaskAsComplete} from '@/actions/tasks'
import {UpdateTaskForm} from "@/components/update-task-form";
import {useAuth} from "react-oidc-context";

const getTaskStatusColor = (status: string) => {
    switch (status) {
        case 'open':
            return 'bg-amber-100 text-amber-800'
        case 'closed':
            return 'bg-red-100 text-red-800'
        case 'expired':
            return 'bg-gray-100 text-gray-800'
        case 'completed':
            return 'bg-green-100 text-green-800'
        default:
            return 'bg-red-100'
    }
}

export function TaskList({tasks, currentUserIsAdmin, users}: {
    tasks: Task[],
    currentUserIsAdmin: boolean,
    users: User[]
}) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [open, setOpen] = useState(false)
    const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false)
    const auth = useAuth()

    return (
        <div className="space-y-4">
            {tasks.length >= 0 && tasks.map((task, idx) => (
                <div
                    key={idx}
                    className="rounded-lg border p-4 space-y-2"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{task.name}</h3>
                        <span
                            className={`px-2 py-1 rounded-full text-sm ${getTaskStatusColor(task.status)}`}>
              {task.status}
            </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="text-sm">
                        {currentUserIsAdmin && (
                            <p>Responsibility: {task.responsibility}</p>
                        )}
                        <p className='text-sm font-semibold'>Deadline: {new Date(task.deadline).toLocaleString()}</p>
                        {task.completed_at && (
                            <p>Completed: {new Date(task.completed_at).toLocaleString()}</p>
                        )}
                        {task.user_comment && (
                            <p>Comment: {task.user_comment}</p>
                        )}
                    </div>
                    <div className="mt-4 flex gap-3">
                        {currentUserIsAdmin && (
                            <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
                                <DialogTrigger asChild>
                                    <Button
                                        onClick={() => setSelectedTask(task)}
                                    >Edit</Button>
                                </DialogTrigger>
                                <DialogContent aria-hidden={false} aria-describedby="update task">
                                    <DialogHeader>
                                        <DialogTitle>Update Task</DialogTitle>
                                    </DialogHeader>
                                    <UpdateTaskForm task={selectedTask!} users={users}/>
                                </DialogContent>
                            </Dialog>
                        )}
                        {task.status === 'open' && (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        Mark as Complete
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Complete Task</DialogTitle>
                                    </DialogHeader>
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault()
                                            if (!selectedTask) return
                                            const formData = new FormData(e.currentTarget)

                                            await markTaskAsComplete(
                                                selectedTask.id,
                                                formData.get('comment') as string,
                                                auth.user?.id_token!
                                            )
                                            setOpen(false)
                                        }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Textarea
                                                name="comment"
                                                placeholder="Add a comment (optional)"
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Complete Task
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}

                    </div>
                </div>
            ))}
            {tasks.length === 0 && (
                <p className="text-center text-muted-foreground">No tasks found.</p>
            )}
        </div>
    )
}

