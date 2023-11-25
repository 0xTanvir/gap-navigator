import React, { useRef, useEffect, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { EditorTools } from "@/components/editorjs/editor-tools";

interface EditorComponentProps {
    onSave: (data: any) => void;
    initialData?: any;
    id:string
}

const Editor = ({onSave, initialData, id}: EditorComponentProps) => {
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const editorRef = useRef<EditorJS>()

    const initializeEditor = async (initialData: any) => {
        let data: { blocks: OutputData['blocks'] } = {blocks: []};

        if (initialData) {
            data = {blocks: [...initialData]};
        }

        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: id,
                // inlineToolbar: ['link', 'marker', 'bold', 'italic'],
                tools: EditorTools,
                data: data,
                placeholder: 'Let`s write recommendation document!',
                onChange: async () => {
                    await editorRef.current?.save().then((outputData) => {
                        onSave(outputData.blocks);
                    })
                },
            });
            editorRef.current = editor
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true)
        }
    }, [])

    useEffect(() => {
        const init = async () => {
            await initializeEditor(initialData)
        }
        if (isMounted) {
            init();
            return () => {
                if (editorRef.current) {
                    editorRef.current?.destroy()
                }
            }
        }
    }, [isMounted])

    // const save = async () => {
    //     if (editorRef.current) {
    //         // editorRef.current?.save().then((outputData) => {
    //         //     onSave(outputData.blocks);
    //         // })
    //         try {
    //             const outputData = await editorRef.current?.save();
    //             console.log('Output Data:', outputData);
    //
    //             if (outputData && outputData.blocks) {
    //                 onSave(outputData.blocks);
    //             }
    //         } catch (error) {
    //             console.error('Error saving editor content:', error);
    //         }
    //     }
    // }

    return (
        <div
            id={id}
            className="prose max-w-full max-h-[100px] border p-2 overflow-y-auto editorjs"
        >
        </div>
    );
};

export default Editor;