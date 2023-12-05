"use client"
import React from 'react';
import { QuestionProvider } from "@/app/(audit)/audit/QuestionContext";

interface QuestionLayoutProps {
    children: React.ReactNode
}

const Layout = ({children}: QuestionLayoutProps) => {
    return (
        <QuestionProvider>
            {children}
        </QuestionProvider>
    );
};

export default Layout;