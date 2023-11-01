"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"
import { AuthContextProvider } from "./auth/auth-provider"

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
    return (
        <AuthContextProvider>
            <NextThemesProvider {...themeProps}>
                {children}
            </NextThemesProvider>
        </AuthContextProvider>
    );
}
