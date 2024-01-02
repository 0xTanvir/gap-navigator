"use client"
import React from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"
import edjsParser from "editorjs-parser";
import { Button } from "@/components/ui/button";
import usePreview from "@/app/(evaluate)/preview-context";

pdfMake.vfs = pdfFonts.pdfMake.vfs

const PreviewPdfDownload = () => {
  const {preview} = usePreview()
  const parser = new edjsParser();
  let data = {
    blocks: preview.thank_you ? JSON.parse(preview.thank_you) : []
  };
  const markup = parser.parse(data);
  return (
      <>
        <div className="w-full text-end">
          <Button disabled>Generate PDF</Button>
        </div>
        <div dangerouslySetInnerHTML={{__html: markup}}></div>
      </>
  );
};

export default PreviewPdfDownload;