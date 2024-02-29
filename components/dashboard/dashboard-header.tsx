import { Skeleton } from "@/components/ui/skeleton"

interface DashboardHeaderProps {
    heading: string
    text?: string
    children?: React.ReactNode
}

export function DashboardHeader({
    heading,
    text,
    children,
}: DashboardHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="grid gap-1">
                <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
                {text && <p className="text-lg text-muted-foreground">{text}</p>}
            </div>
            {children}
        </div>
    )
}

DashboardHeader.Skeleton = function DashboardHeaderSkeleton() {
    return (
        <div className="px-2">
            <div className="space-y-3">
                <Skeleton className="h-12 w-1/5" />
                <Skeleton className="h-4 w-2/5" />
            </div>
        </div>
    )
}