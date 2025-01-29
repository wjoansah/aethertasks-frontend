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
    deadline: number
    responsibility: string
    completed_at?: string
    user_comment?: string
}

