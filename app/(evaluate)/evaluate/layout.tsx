"use client"
import {EvaluationProvider} from "@/app/(evaluate)/evaluate/evaluate-context";

interface EvaluateLayoutProps {
    children: React.ReactNode
}

export default function EvaluateLayout({children}: EvaluateLayoutProps) {
    return (
        <EvaluationProvider>
            {children}
        </EvaluationProvider>
    )
}