import React from 'react';
import { Evaluate } from "@/types/dto";
import { Button } from "@/components/ui/button";
import htmlToPdfmake from "html-to-pdfmake";
import edjsParser from "editorjs-parser";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import pdfMake from "pdfmake/build/pdfmake";
import { generateRandomText } from "@/lib/utils";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface EvaluationItemProps {
  evaluation: Evaluate
}

const EvaluationItem = ({evaluation}: EvaluationItemProps) => {
  const parser = new edjsParser();

  function evaluateFormat(evaluation: Evaluate) {
    try {
      const choices = evaluation.choices;
      let results: any[] = [];

      choices?.forEach(choice => {
        const additionalNote = choice.additionalNote;
        const recommendedNote = choice.recommendedNote;
        const internalNote = choice.internalNote;
        results.push({
          additionalNote,
          recommendedNote,
          internalNote
        });
      });

      let reportData = results.flatMap(item => {
        const recommendedNoteData = item.recommendedNote ? JSON.parse(item.recommendedNote) : [];
        const additionalNoteData = item.additionalNote ? JSON.parse(item.additionalNote) : [];
        const internalNoteData = item.internalNote ? JSON.parse(item.internalNote) : [];

        return recommendedNoteData.concat(additionalNoteData, internalNoteData);
      });

      let data = {
        blocks: reportData
      };

      const markup = parser.parse(data);
      let html = htmlToPdfmake(markup)

      const docDefinition: TDocumentDefinitions = {
        header: {
          text: 'Gap Navigator', fontSize: 14, alignment: 'center', margin: [10, 10]
        },
        footer: function (currentPage: number, pageCount: number) {
          return {
            text: currentPage.toString() + ' of ' + pageCount,
            alignment: 'center'
          }
        },
        watermark: {
          text: 'Gap Navigator',
          color: 'gray',
          opacity: 0.3,
          bold: true,
          italics: false
        },
        pageSize: 'A4',
        info: {
          title: `${evaluation.auditName}`,
          author: 'Gap Navigator',
          subject: 'subject of document',
          keywords: 'keywords for document',
          creator: 'Gap Navigator',
          producer: 'Gap Navigator',
        },
        content: [
          html
        ],
      };
      const createPdf = () => {
        const pdfGenerator = pdfMake.createPdf(docDefinition, {});
        pdfGenerator.download(`${generateRandomText(6)}.pdf`);
      };

      createPdf();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  return (
      <div className="flex items-center justify-between p-4">
        <div className="grid gap-1">
          <div className="flex gap-2">
            <div className="font-semibold">
              {evaluation.auditName}
            </div>
          </div>
          <div>
            <p className="flex text-sm text-muted-foreground">
              {evaluation.participantEmail}
            </p>
          </div>
        </div>

        <Button
            onClick={() => evaluateFormat(evaluation)}
        >
          Generate Report
        </Button>

      </div>
  );
};

export default EvaluationItem;