import React from 'react';
import { AuditEvaluations } from "@/types/dto";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import htmlToPdfmake from "html-to-pdfmake";
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import pdfMake from "pdfmake/build/pdfmake";
import { generateRandomText } from "@/lib/utils";
import edjsParser from "editorjs-parser";
import pdfFonts from "pdfmake/build/vfs_fonts";

interface ClientAuditItemProps {
  audit: AuditEvaluations
}

pdfMake.vfs = pdfFonts.pdfMake.vfs

const ClientAuditItem = ({audit}: ClientAuditItemProps) => {
  const router = useRouter()
  const parser = new edjsParser();

  function evaluateFormat() {
    const choices = audit.choices;
    let results: any[] = [];

    choices?.forEach(choice => {
      const questionId = choice.questionId;
      const answerId = choice.answerId;

      // Find the question with the specified questionId
      const question = audit?.questions?.find(q => q.uid === questionId);

      if (question) {
        // Find the answer with the specified answerId
        const answer = question.answers.find(a => a.uid === answerId);

        if (answer) {
          // Retrieve the recommendationDocument for the answer
          const recommendationDocument = answer.recommendationDocument;

          // Update the choice with the recommendedNote
          choice.recommendedNote = recommendationDocument;

          // Push the result to the array
          results.push({
            questionId,
            answerId,
            questionName: question.name,
            recommendationDocument,
          });
        }
      }
    });

    return results;
  }

  const evaluationFormatData = evaluateFormat();
  let reportData = (evaluationFormatData.filter(data => data.recommendationDocument) || [])
    .flatMap(item => JSON.parse(item?.recommendationDocument ?? '[]'));
  if (audit.welcome) {
    reportData = [...JSON.parse(audit.welcome), ...reportData]
  }

  let pdfData = {
    blocks: reportData
  };

  const generateAndDownloadPdf = async () => {
    try {
      if (!reportData) {
        throw new Error('Invalid evaluation data');
      }

      // Arrays to store indices
      const imageIndices: number[] = [];
      const embedIndices: number[] = [];
      const checkListIndices: number[] = [];
      const tableIndices: number[] = [];
      const delimiterIndices: number[] = [];
      const warningIndices: number[] = [];

      const formatDataImage: any[] = []
      const formatDataEmbed: any[] = []
      const formatDataCheckList: any[] = []
      const formatDataTable: any[] = []
      const formatDataDelimiter: any[] = []
      const formatDataWarning: any[] = []

      pdfData.blocks.forEach((element: any, index: number) => {
        if (element.type === "image") {
          imageIndices.push(index);
          formatDataImage.push(pdfData.blocks[index])
        } else if (element.type === "embed") {
          embedIndices.push(index);
          formatDataEmbed.push(pdfData.blocks[index])
        } else if (element.type === "checklist") {
          checkListIndices.push(index);
          formatDataCheckList.push(pdfData.blocks[index])
        } else if (element.type === "table") {
          tableIndices.push(index);
          formatDataTable.push(pdfData.blocks[index])
        } else if (element.type === "delimiter") {
          delimiterIndices.push(index);
          formatDataDelimiter.push(pdfData.blocks[index])
        } else if (element.type === "warning") {
          warningIndices.push(index);
          formatDataWarning.push(pdfData.blocks[index])
        }
      });

      let pdfMakeImageData: any
      let pdfMakeEmbedData: any
      let pdfMakeCheckListData: any
      let pdfMakeTableData: any
      let pdfMakeDelimiterData: any
      let pdfMakeWarningData: any
      if (formatDataImage) {
        pdfMakeImageData = generatePdfDefinition(formatDataImage)
      }
      if (formatDataEmbed) {
        pdfMakeEmbedData = generatePdfDefinition(formatDataEmbed)
      }
      if (formatDataCheckList) {
        pdfMakeCheckListData = generatePdfDefinition(formatDataCheckList)
      }
      if (formatDataTable) {
        pdfMakeTableData = generatePdfDefinition(formatDataTable)
      }
      if (formatDataDelimiter) {
        pdfMakeDelimiterData = generatePdfDefinition(formatDataDelimiter)
      }
      if (formatDataWarning) {
        pdfMakeWarningData = generatePdfDefinition(formatDataWarning)
      }

      const markup = parser.parse(pdfData);
      let html = htmlToPdfmake(markup)

      // @ts-ignore
      html = html?.filter((node) => node.nodeName !== 'FIGURE') || [];
      // @ts-ignore
      html = html?.filter((node) => node.nodeName !== "TABLE") || [];

      if (imageIndices.length > 0) {
        imageIndices.forEach((data, index) => {
          // @ts-ignore
          html.splice(data + index, 0, pdfMakeImageData[index]);
        });
      }

      if (embedIndices.length > 0) {
        embedIndices.forEach((data, index) => {
          // @ts-ignore
          html.splice(data + index, 0, pdfMakeEmbedData[index]);
        });
      }

      if (checkListIndices.length > 0) {
        checkListIndices.forEach((data, index) => {
          // @ts-ignore
          html.splice(data + index, 0, pdfMakeCheckListData[index]);
        });
      }
      if (tableIndices.length > 0) {
        tableIndices.forEach((data, index) => {
          // @ts-ignore
          html.splice(data + index, 0, pdfMakeTableData[index]);
        });
      }
      if (delimiterIndices.length > 0) {
        delimiterIndices.forEach((data, index) => {
          // @ts-ignore
          html.splice(data + index, 0, pdfMakeDelimiterData[index]);
        });
      }
      if (warningIndices.length > 0) {
        warningIndices.forEach((data, index) => {
          // @ts-ignore
          html.splice(data + index, 0, pdfMakeWarningData[index]);
        });
      }

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
        },
        pageSize: 'A4',
        info: {
          title: `${audit.name}`,
          author: 'Gap Navigator',
          subject: 'subject of document',
          keywords: 'keywords for document',
          creator: 'Gap Navigator',
          producer: 'Gap Navigator',
        },
        content: [
          html
        ],
        styles: {
          warningTitle: {fontSize: 14, bold: true, color: 'black', alignment: "justify"},
          warningMessage: {fontSize: 12, color: 'black', alignment: "justify"},
        },
        defaultStyle: {
          alignment: "justify"
        }
      };
      const createPdf = () => {
        const pdfGenerator = pdfMake.createPdf(docDefinition, {});
        pdfGenerator.download(`${generateRandomText(6)}.pdf`);
      };

      createPdf();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <div className="flex gap-2">
          <Link
            href={`/evaluate/${audit.auditUid}`}
            className="font-semibold hover:underline"
          >
            {audit.name}
          </Link>

          {
            audit.isCompleted === true &&
              <Badge variant="outline" className="h-4 py-2 text-blue-600">Complete</Badge>
          }
          {
            audit.isCompleted === false &&
              <Badge variant="outline" className="h-4 py-2 text-gray-600">Incomplete</Badge>
          }
          {
            audit.isCompleted === "invited" &&
              <Badge variant="outline" className="h-4 py-2 text-blue-600">New</Badge>
          }

        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="h-4 w-4"/>
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onClick={() => {
              router.push(`/evaluate/${audit.auditUid}`)
            }}
          >
            {audit.isCompleted === true ?
              <><Icons.fileEdit className="mr-2 h-4 w-4"/>Edit</> :
              <>
                <Icons.evaluate className="mr-2 h-4 w-4"/>
                Evaluate
              </>
            }
          </DropdownMenuItem>

          {
            audit.isCompleted === true &&
              <>
                  <DropdownMenuSeparator/>

                  <DropdownMenuItem
                      className="flex cursor-pointer items-center"
                      onClick={generateAndDownloadPdf}
                  >
                      <Icons.fileEdit className="mr-2 h-4 w-4"/>
                      Reports
                  </DropdownMenuItem>
              </>
          }

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

ClientAuditItem.Skeleton = function clientAuditItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-full"/>
      </div>
    </div>
  )
}

export default ClientAuditItem;

interface DataItems {
  id: string;
  type: string;
  data: { [key: string]: any };
}

function generatePdfDefinition(data: DataItems[]) {
  const content: Content[] = [];

  data.forEach((item) => {
    switch (item.type) {
      case 'embed':
        let data: any = {
          text: item.data.caption || "Link",
          link: item.data.source,
          color: "blue",
          decoration: 'underline',
          margin: [0, 3],
        }
        content.push(data)
        break;
      case 'image':
        content.push(
          {
            image: item.data.url,
            width: 500,
            margin: [0, 6]
          }
        );
        break;
      case 'quote':
        content.push({text: item.data.text, style: 'quote', alignment: item.data.alignment});
        break;
      case 'table':
        const tableContent: Content[][] = item.data.content.map((row: string[]) =>
          row.map(cell => ({text: cell}))
        );

        // Calculate the number of header rows dynamically
        const headerRows = tableContent.length > 0 ? 1 : 0;

        // Calculate the number of columns dynamically
        const numColumns = tableContent.length > 0 ? tableContent[0].length : 0;

        // Calculate the default width for each column
        // const defaultColumnWidth = 100 / numColumns;
        const defaultColumnWidth = "*";

        // Generate an array of default widths for each column
        const defaultWidths = new Array(numColumns).fill(defaultColumnWidth);
        content.push({
          table: {
            headerRows,
            widths: defaultWidths,
            body: tableContent,
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#CCCCCC' : null;
            },
          },
          margin: [0, 5]
        });
        break;
      case 'checklist':
        const checklistItems = item.data.items.map((checklistItem: { text: string, checked: boolean }) => ({
          text: checklistItem.text,
          decoration: checklistItem.checked ? 'lineThrough' : undefined,  // Omit decoration property for unchecked items
        }));
        content.push({ul: checklistItems, margin: [0, 5]});
        break;

      case 'delimiter':
        content.push({
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 5,
              x2: 520,
              y2: 5,
              lineWidth: 1,
              lineColor: '#000000'
            }
          ],
          margin: [0, 10], // Add margin (adjust values as needed)
        });
        break;

      case 'warning':
        const warningContent: Content[] = [
          {text: item.data.title, style: 'warningTitle'},
          {text: item.data.message, style: 'warningMessage'},
        ];

        content.push({
          table: {
            body: [warningContent],
            widths: [100, '*'], // Adjust the width as needed
          },
          fillColor: "yellow",
          // layout: 'noBorders', // Remove cell borders
          margin: [0, 10], // Add margin (adjust values as needed)

        });
        break;
      // Add more cases for other supported types (image, code, quote, table, checklist, etc.)

      default:
        break;
    }
  });

  return content
}