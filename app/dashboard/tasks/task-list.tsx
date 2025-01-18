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
import {updateTaskStatus} from '@/actions/tasks'

export function TaskList({tasks, currentUser}: { tasks: Task[], currentUser: User }) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [open, setOpen] = useState(false)

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="rounded-lg border p-4 space-y-2"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{task.name}</h3>
                        <span
                            className={`px-2 py-1 rounded-full text-sm ${
                                task.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
              {task.status}
            </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="text-sm">
                        <p>Deadline: {task.deadline}</p>
                        {task.completed_at && (
                            <p>Completed: {new Date(task.completed_at).toLocaleDateString()}</p>
                        )}
                        {task.user_comment && (
                            <p>Comment: {task.user_comment}</p>
                        )}
                    </div>
                    {currentUser.role === 'user' && task.status === 'pending' && (
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
                                        await updateTaskStatus(
                                            selectedTask.id,
                                            'completed',
                                            formData.get('comment') as string
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
            ))}
            {tasks.length === 0 && (
                <p className="text-center text-muted-foreground">No tasks found.</p>
            )}
        </div>
    )
}

