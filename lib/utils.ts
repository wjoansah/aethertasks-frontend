import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export function decodeJwt(token: string): Record<string, any> | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            throw new Error("Invalid JWT token format.");
        }

        const payload = parts[1];

        const decodedPayload = atob(payload);

        return JSON.parse(decodedPayload);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed to decode JWT:", error.message);
        }
        return null;
    }
}
