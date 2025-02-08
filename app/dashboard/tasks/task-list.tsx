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
import {Task, TaskStatus, User} from '@/types'
import {markTaskAsComplete} from '@/actions/tasks'
import {Input} from "@/components/ui/input";
import {Label} from '@/components/ui/label'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {useStore} from "@/store";
import {useAuth} from "react-oidc-context";
import {updateTask} from "@/actions/tasks";
import {useRouter} from 'next/navigation'

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
    const initTask: Task = {
        name: '',
        responsibility: '',
        id: '',
        status: 'open',
        description: '',
        deadline: 0
    }

    const [selectedTask, setSelectedTask] = useState<Task>(initTask)
    const [openCompleteDialog, setOpenCompleteDialog] = useState(false)
    const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false)

    const handleTaskUpdate = (task: Task, operation: 'update' | 'completion') => {
        setSelectedTask(task)
        console.log(task)
        if (operation === 'update') {
            setOpenUpdateDialog(!openUpdateDialog)
        }
        if (operation === 'completion') {
            setOpenCompleteDialog(!openCompleteDialog)
        }
    }

    return (
        <>
            <UpdateTaskForm
                task={selectedTask}
                openDialog={openUpdateDialog}
                onOpenChange={setOpenUpdateDialog}
                users={users}/>

            <CompleteTaskForm
                task={selectedTask}
                openDialog={openCompleteDialog}
                onOpenChange={setOpenCompleteDialog}/>

            <div className="space-y-4">
                {tasks.length > 0 && tasks.map((task, idx) => (
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
                        <div className="text-sm flex flex-col gap-2">
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
                                <Button onClick={() => handleTaskUpdate(task, 'update')}>Edit</Button>
                            )}
                            {task.status === 'open' && (
                                <Button
                                    variant='outline'
                                    onClick={() => handleTaskUpdate(task, 'completion')}>Mark as Complete</Button>
                            )}
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <p className="text-center text-muted-foreground">No tasks found.</p>
                )}
            </div>
        </>
    )
}

const CompleteTaskForm = ({task, openDialog, onOpenChange}: {
    task: Task,
    openDialog: boolean,
    onOpenChange: (open: boolean) => void
}) => {
    const auth = useAuth()
    const router = useRouter();

    return (
        <Dialog open={openDialog} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent aria-description="complete task" aria-describedby="complete task">
                <DialogHeader>
                    <DialogTitle>Complete Task</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault()
                        if (!task) return
                        const formData = new FormData(e.currentTarget)

                        await markTaskAsComplete(
                            task.id,
                            formData.get('comment') as string,
                            auth.user?.id_token!
                        )
                        onOpenChange(false)
                        router.refresh()
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
    )
}


const UpdateTaskForm = ({task, openDialog, onOpenChange, users}: {
    task: Task,
    openDialog: boolean,
    onOpenChange: (open: boolean) => void,
    users: User[]
}) => {
    const [loading, setLoading] = useState(false)
    const [taskUpdates, setTaskUpdates] = useState<Partial<Task>>(task);

    const router = useRouter();
    const store = useStore()
    const auth = useAuth()

    const statuses = ["open", "closed", "completed"];

    return (
        <Dialog open={openDialog} onOpenChange={onOpenChange}>
            <DialogContent aria-description="update task" aria-describedby="update task">
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogHeader>
                    <DialogTitle>Update Task</DialogTitle>
                </DialogHeader>
                <form
                    action={async (formData) => {
                        setLoading(true)
                        const result = await updateTask(task.id, formData, auth.user?.id_token!);
                        setLoading(false)

                        onOpenChange(false)
                        router.refresh()
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="name">Task Name</Label>
                        <Input
                            id="name" name="name" value={taskUpdates.name}
                            defaultValue={task.name}
                            onChange={(e) => setTaskUpdates({
                                ...taskUpdates,
                                name: e.target.value
                            })}
                            required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            aria-describedby="description"
                            name="description"
                            defaultValue={task.description}
                            onChange={(e) => setTaskUpdates({
                                ...taskUpdates,
                                description: e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                            id="deadline"
                            name="deadline"
                            type="datetime-local"
                            defaultValue={new Date(task.deadline).toISOString().slice(0, -1)}
                            onChange={(value) => setTaskUpdates({
                                ...taskUpdates,
                                deadline: new Date(value.target.value).getTime()
                            })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="responsibility">Assign To</Label>
                        <Select name="responsibility" defaultValue={task.responsibility}
                                onValueChange={(value) => setTaskUpdates({
                                    ...taskUpdates,
                                    responsibility: value
                                })} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select user"/>
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user, idx) => (
                                    <SelectItem key={idx} value={user.email}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" value={taskUpdates.status} defaultValue={task.status}
                                onValueChange={(value) => setTaskUpdates({
                                    ...taskUpdates,
                                    status: value as TaskStatus
                                })}
                                required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status"/>
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status, idx) => (
                                    <SelectItem key={idx} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {store.userIsAdmin && (
                        <Button disabled={loading} type="submit" className="w-full">
                            Update Task
                        </Button>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
