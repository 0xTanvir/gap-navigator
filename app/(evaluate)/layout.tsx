import { PreviewProvider } from "./preview-context"

interface DocsLayoutProps {
    children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
    return (
        <PreviewProvider>
            {children}
        </PreviewProvider>
    )
}
