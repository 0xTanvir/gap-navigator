"use client"
import React from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"
import {Button} from "@/components/ui/button";
import usePreview from "@/app/(evaluate)/preview-context";
import {DocsPageHeader} from "@/app/(evaluate)/preview/page-header";
import Output from "editorjs-react-renderer";
import {CodeBlockRenderer, style} from "@/components/editorjs/editorjs-utils";
import "@/components/editorjs/editorjs.css"

pdfMake.vfs = pdfFonts.pdfMake.vfs

const PreviewPdfDownload = () => {
    const {preview} = usePreview()
    let data = {
        time: Date.now(),
        blocks: preview.thank_you ? JSON.parse(preview.thank_you) : [],
        version: "2.0.0"
    };
    const renderers = {
        code: CodeBlockRenderer
    };
    return (
        <>
            <DocsPageHeader
                heading={preview.name}
                text={"Analyze your report."}
            />
            <div className="w-full text-end">
                <Button>Generate PDF</Button>
            </div>
            <div className="editorjs">
                <Output data={data} style={style} renderers={renderers}/>
            </div>
        </>
    );
};

export default PreviewPdfDownload;