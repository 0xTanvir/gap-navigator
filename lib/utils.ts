import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from 'firebase/firestore'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(input: Timestamp): string {
    const date = input.toDate()
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

export function generateRandomText(length: any) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomText = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomText += characters.charAt(randomIndex);
    }

    return randomText;
}