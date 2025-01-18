'use server'

import { revalidatePath } from 'next/cache'
// import { User } from '@/types'

type User = {
    id: string
    name: string
    email: string
    role: 'user' | 'admin'
}

// Simulated database
let users: User[] = []
let lastId = 0

export async function createUser(formData: FormData) {
    const user: User = {
        id: String(++lastId),
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: 'user',
    }

    users.push(user)
    revalidatePath('/users')
    return { success: true, data: users }
}

export async function getUsers() {
    return users
}

