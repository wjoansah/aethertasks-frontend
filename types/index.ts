export type User = {
    name: string
    email: string
}

export type TaskStatus = 'open' | 'closed' | 'completed'

export type Task = {
    id: string
    name: string
    description: string
    status: TaskStatus,
    deadline: string
    responsibility: string
    completed_at?: string
    user_comment?: string
}

