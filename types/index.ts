export type User = {
    name: string
    email: string
    role: UserRole
}

export type UserRole = 'admin' | 'user';

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

