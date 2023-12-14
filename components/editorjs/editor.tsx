import React, { useRef, useEffect, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { EditorTools } from "@/components/editorjs/editor-tools";

interface EditorComponentProps {
    onSave: (data: any) => void;
    initialData?: any;
    id?: string
    placeHolder?: string
}

const Editor = ({onSave, initialData, id, placeHolder}: EditorComponentProps) => {
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const editorRef = useRef<EditorJS>()

    const initializeEditor = async (initialData: any) => {
        let data: { time: number, blocks: OutputData['blocks'] } = {time: new Date().getTime(), blocks: []};

        if (initialData) {
            data = {
                time: new Date().getTime(),
                blocks: [...initialData]
            };
        }

        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: id || "editorjs",
                tools: EditorTools,
                data: data,
                placeholder: placeHolder || 'Let`s write your text!',
                onReady() {
                    editorRef.current = editor
                },
                onChange: async () => {
                    await editor.saver.save().then((outputData) => {
                        onSave(outputData.blocks);
                    })
                    // await editorRef.current?.save().then((outputData) => {
                    //     onSave(outputData.blocks);
                    // })
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
                    // @ts-ignore
                    editorRef.current = null
                }
            }
        }
    }, [isMounted])

    return (
        <div
            id={id || "editorjs"}
            className="prose max-w-full border p-2 overflow-y-auto editorjs"
        >
        </div>
    );
};

export default Editor;