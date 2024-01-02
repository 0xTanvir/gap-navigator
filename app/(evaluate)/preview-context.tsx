"use client"

import { createContext, useContext, useReducer, Dispatch } from 'react'
import { Preview, PreviewAction } from '@/types/dto'
import { previewReducer } from './preview-reducer'
import { Timestamp } from 'firebase/firestore'

interface PreviewContextType {
    preview: Preview
    dispatch: Dispatch<PreviewAction>
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined)

interface PreviewProviderProps {
    children: React.ReactNode
    initialPreview?: Preview
}

export const PreviewProvider: React.FC<PreviewProviderProps> = ({ children, initialPreview }) => {
    // Define the initial state
    const initialState: Preview = initialPreview || {
        // provide default values for your Preview structure
        uid: '',
        name: '',
        type: '',
        welcome: '',
        thank_you: '',
        authorId: '',
        createdAt: Timestamp.now(),
        questions: [],
        sideBarNav: [],
    };

    // Use the useReducer hook to get the current state and dispatch function
    const [preview, dispatch] = useReducer(previewReducer, initialState)

    return (
        <PreviewContext.Provider value={{ preview, dispatch }}>
            {children}
        </PreviewContext.Provider>
    )
}

const usePreview = () => {
    const context = useContext(PreviewContext)

    if (context === undefined) {
        throw new Error("usePreview must be used within PreviewContext")
    }

    return context
};

export default usePreview