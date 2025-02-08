'use server'

import {revalidatePath} from 'next/cache'
import {Task, TaskStatus} from '@/types'

const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY!

export async function createTask(formData: FormData, idToken: string) {
    const task: Omit<Task, 'id'> = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        status: 'open',
        deadline: new Date(formData.get('deadline') as string).getTime(),
        responsibility: formData.get('responsibility') as string,
    }

    const response = await fetch(`${baseUrl}/tasks`, {
        headers: {
            'Authorization': idToken
        },
        method: 'POST',
        body: JSON.stringify(task)
    })

    if (response.ok) {
        revalidatePath('/dashboard/tasks', 'page')
        return {success: true}
    }

    return {success: false}
}

export async function updateTask(id: string, formData: FormData, idToken: string) {
    const task: Partial<Task> = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as TaskStatus,
        deadline: new Date(formData.get('deadline') as string).getTime(),
        responsibility: formData.get('responsibility') as string,
    }

    const response = await fetch(`${baseUrl}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': idToken
        },
        body: JSON.stringify(task)
    })

    if (response.ok) {
        revalidatePath('/dashboard/tasks', 'page')
        return {success: true}
    }
    return {success: false, error: response.statusText}
}

export async function markTaskAsComplete(taskId: string, userComment: string, idToken: string) {
    const body = {
        id: taskId,
        userComment: userComment,
    }

    const response = await fetch(`${baseUrl}/tasks/complete`, {
        method: 'PUT',
        headers: {
            'Authorization': idToken
        },
        body: JSON.stringify(body),
    })

    if (response.ok) {
        revalidatePath('/dashboard/tasks')
        return {success: true}
    }
    return {success: false, error: response.statusText}
}

export async function getTasks(isAdmin: boolean, idToken: string) {
    const taskEndpoint = isAdmin ? '' : '/myTasks'
    const response = await fetch(`${baseUrl}/tasks${taskEndpoint}`, {
        headers: {
            "Authorization": idToken
        }
    })
    return await response.json()
}

