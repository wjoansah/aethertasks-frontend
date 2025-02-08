'use server'

import {revalidatePath} from 'next/cache'
import {User} from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY!

export async function createUser(formData: FormData, idToken: string) {
    const user: User = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('admin') as unknown as boolean ? "admin" : "user"
    }

    const response = await fetch(`${baseUrl}/users/invite`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Authorization': idToken
        }
    })

    if (!response.ok) {
        return {success: false, error: response.statusText}
    }

    const body = await response.json()

    revalidatePath('/dashboard/users', 'page')
    return {success: true, data: body}
}

export async function getUsers(idToken: string) {
    const response = await fetch(`${baseUrl}/users`, {
        headers: {
            'Authorization': idToken
        }
    })
    if (!response.ok) {
        return {success: false, error: response.statusText}
    }
    const data = await response.json()
    const users = data.users.map((response: any) => {
        const emailAttribute = response.Attributes.find((attr: any) => attr.Name === "email")
        const nameAttribute = response.Attributes.find((attr: any) => attr.Name === "name")
        const roleAttribute = response.Attributes.find((attr: any) => attr.Name === "custom:role")
        return {
            email: emailAttribute.Value,
            name: nameAttribute.Value,
            role: roleAttribute.Value
        }
    })

    revalidatePath('/dashboard/users', 'page')
    return {success: true, data: users}
}
