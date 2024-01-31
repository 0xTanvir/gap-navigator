"use client"
import React, { useEffect } from 'react';
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";
import pdfMake from "pdfmake/build/pdfmake";
import { Content, TableCell, TDocumentDefinitions } from "pdfmake/interfaces";
import pdfFonts from "pdfmake/build/vfs_fonts"
import { generateRandomText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import htmlToPdfmake from "html-to-pdfmake"
import edjsParser from "editorjs-parser";
import { DocsPageHeader } from "@/app/(evaluate)/preview/page-header";
import Output from "editorjs-react-renderer";
import { CodeBlockRenderer, ImageBlock, style } from "@/components/editorjs/editorjs-utils";
import "@/components/editorjs/editorjs.css"

pdfMake.vfs = pdfFonts.pdfMake.vfs

const PdfDownload = () => {
  const {evaluation} = useEvaluation()
  const {uid} = evaluation
  const router = useRouter()
  const parser = new edjsParser();
  let data = {
    time: Date.now(),
    blocks: evaluation.thank_you ? JSON.parse(evaluation.thank_you) : [],
    version: "2.0.0"
  };

  const renderers = {
    code: CodeBlockRenderer,
    image: ImageBlock
  };

  function evaluateFormat() {
    const choices = evaluation.evaluate.choices;
    let results: any[] = [];

    choices?.forEach(choice => {
      const questionId = choice.questionId;
      const answerId = choice.answerId;

      // Find the question with the specified questionId
      const question = evaluation.questions.find(q => q.uid === questionId);

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

  // Call the function to evaluate choices and get the results array
  const evaluationFormatData = evaluateFormat();


  let evaluate = (evaluationFormatData.filter(data => data.recommendationDocument) || [])
    .flatMap(item => JSON.parse(item?.recommendationDocument ?? '[]'))

  let evaluationData = {
    time: Date.now(),
    blocks: evaluate,
    version: "2.0.1"
  };

  let reportData = (evaluationFormatData.filter(data => data.recommendationDocument) || [])
    .flatMap(item => JSON.parse(item?.recommendationDocument ?? '[]'));
  if (evaluation.welcome) {
    reportData = [...JSON.parse(evaluation.welcome), ...reportData]
  }

  let pdfData = {
    blocks: reportData
  };


  const generateAndDownloadPdf = async () => {
    try {
      if (!evaluation || !evaluation.evaluate) {
        throw new Error('Invalid evaluation data');
      }

      // Arrays to store indices
      const imageIndices: number[] = [];
      const embedIndices: number[] = [];
      const checkListIndices: number[] = [];
      const tableIndices: number[] = [];
      const formatDataImage: any[] = []
      const formatDataEmbed: any[] = []
      const formatDataCheckList: any[] = []
      const formatDataTable: any[] = []

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
        }
      });

      let pdfMakeImageData: any
      let pdfMakeEmbedData: any
      let pdfMakeCheckListData: any
      let pdfMakeTableData: any
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

      // const evaluationChoiceRecommendedNote = (evaluation?.evaluate?.choices?.filter(choice => choice.recommendedNote) || [])
      //   .flatMap(item => JSON.parse(item?.recommendedNote ?? '[]'));

      // let reportData = (evaluationFormatData.filter(data => data.recommendationDocument) || [])
      //   .flatMap(item => JSON.parse(item?.recommendationDocument ?? '[]'));
      // if (evaluation.welcome) {
      //   reportData = [...JSON.parse(evaluation.welcome), ...reportData]
      // }
      //
      // // reportData = [...reportData, ...evaluationChoiceRecommendedNote]
      //
      // let data = {
      //   blocks: reportData
      // };

      // const markup = parser.parse(pdfData);
      // let html = htmlToPdfmake(markup)
      //
      // let datas = generatePdfDefinition(pdfData.blocks)
      // console.log(datas)
      // console.log(formatDataImage)
      // console.log(formatDataEmbed)

      // let docContent = await pdfGenerator(data); // Await the async function

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
          title: `${evaluation.name}`,
          author: 'Gap Navigator',
          subject: 'subject of document',
          keywords: 'keywords for document',
          creator: 'Gap Navigator',
          producer: 'Gap Navigator',
        },
        content: [
          html
          // ...(docContent.content as Content []),
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
  };

  useEffect(() => {
    // Check if evaluation is not available or is empty, then navigate
    if (!evaluation || Object.entries(evaluation.evaluate).length === 0) {
      router.push(`/evaluate/${uid}`);
    }
  }, [evaluation, uid, router]);

  return (
    <>
      <DocsPageHeader
        heading={evaluation.name}
        text={"Analyze your report."}
      />
      <div className="w-full text-end">
        <Button onClick={generateAndDownloadPdf}>Generate PDF</Button>
      </div>
      <div className="editorjs">
        <Output data={data} style={style} renderers={renderers}/>
        <Output data={evaluationData} style={style} renderers={renderers}/>
      </div>

    </>
  );
};

export default PdfDownload;

interface DataItem {
  id: string;
  type: string;
  data: { [key: string]: any };
}

function generatePdfDefinition(data: DataItem[]) {
  const content: Content[] = [];

  data.forEach((item) => {
    switch (item.type) {
      case 'header':
        content.push({text: item.data.text, style: `header${item.data.level}`});
        break;
      case 'paragraph':
        content.push({text: item.data.text, style: 'paragraph'});
        break;
      case 'list':
        const listItems = item.data.items.map((listItem: string) => ({text: listItem}));
        content.push({ul: listItems});
        break;
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
            width: 500
          }
        );
        break;
      case 'code':
        content.push({text: item.data.code, style: 'code'});
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
          }
        });
        break;
      case 'checklist':
        const checklistItems = item.data.items.map((checklistItem: { text: string, checked: boolean }) => ({
          text: checklistItem.text,
          decoration: checklistItem.checked ? 'lineThrough' : undefined,  // Omit decoration property for unchecked items
        }));
        content.push({ul: checklistItems, margin: [0, 5]});
        break;
      // Add more cases for other supported types (image, code, quote, table, checklist, etc.)

      default:
        break;
    }
  });

  return content
}
