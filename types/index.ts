export type User = {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
}

export type Task = {
    name: string
    description: string
    status: 'open' | 'closed' | 'completed'
    deadline: string
    responsibility: string
    completed_at?: string
    user_comment?: string
}

