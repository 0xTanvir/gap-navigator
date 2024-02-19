'use client'
import React, { useEffect, useState } from 'react';
import { getAuditsEvaluationById } from "@/lib/firestore/evaluation";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import Output from "editorjs-react-renderer";
import { CodeBlockRenderer, style } from "@/components/editorjs/editorjs-utils";
import { AuditEvaluations } from "@/types/dto";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import htmlToPdfmake from "html-to-pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import pdfMake from "pdfmake/build/pdfmake";
import { generateRandomText } from "@/lib/utils";
import edjsParser from "editorjs-parser";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generatePdfDefinition } from "@/app/(evaluate)/evaluate/[auditId]/completed/pdf-download";

const Editor = dynamic(() => import("@/components/editorjs/editor"), {
  ssr: false,
});

interface ReviewComponent {
  auditId: string
}

pdfMake.vfs = pdfFonts.pdfMake.vfs
const ReviewComponent = ({auditId}: ReviewComponent) => {
  const [audit, setAudit] = useState<AuditEvaluations | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {user} = useAuth();
  const router = useRouter()
  const parser = new edjsParser();

  async function fetchAuditsEvaluation() {
    setIsLoading(true)
    try {
      if (user?.invitedAuditsList) {
        let data = await getAuditsEvaluationById(auditId, user.email)
        if (data) {
          setAudit(data)
        }
      }
    } catch (err) {
      toast.error("Something went wrong.", {
        description: "Failed to fetch audits. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  let data;
  if (audit?.thank_you) {
    data = {
      time: Date.now(),
      blocks: audit?.thank_you ? JSON.parse(audit?.thank_you) : [],
      version: "2.0.0"
    };
  }
  const renderers = {
    code: CodeBlockRenderer
  };


  function evaluateFormat() {
    const choices = audit?.choices;
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
  if (audit?.welcome) {
    reportData = [...JSON.parse(audit.welcome), ...reportData]
  }

  let pdfData = {
    blocks: reportData
  };

  const generateAndDownloadPdf = async () => {
    setLoading(true)
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
        pdfMakeImageData = await generatePdfDefinition(formatDataImage)
      }
      if (formatDataEmbed) {
        pdfMakeEmbedData = await generatePdfDefinition(formatDataEmbed)
      }
      if (formatDataCheckList) {
        pdfMakeCheckListData = await generatePdfDefinition(formatDataCheckList)
      }
      if (formatDataTable) {
        pdfMakeTableData = await generatePdfDefinition(formatDataTable)
      }
      if (formatDataDelimiter) {
        pdfMakeDelimiterData = await generatePdfDefinition(formatDataDelimiter)
      }
      if (formatDataWarning) {
        pdfMakeWarningData = await generatePdfDefinition(formatDataWarning)
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
          title: `${audit?.name}`,
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
        toast.success("It will take some time.")
        setLoading(false)
        const pdfGenerator = pdfMake.createPdf(docDefinition, {});
        pdfGenerator.download(`${generateRandomText(6)}.pdf`);
      };

      createPdf();
    } catch (error) {
      toast.error("Error generating PDF")
      setLoading(false)
      console.error('Error generating PDF:', error);
    }
  };

  useEffect(() => {
    fetchAuditsEvaluation();
  }, [user?.invitedAuditsList]);

  if (isLoading) {
    return <Icons.spinner/>
  }

  return (
    <div>
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => router.push("/audits")}
        >
          <Icons.back className="mr-2 h-4 w-4"/>
          Back
        </Button>
        <Button onClick={generateAndDownloadPdf}>
          {
            loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
          }
          Generate PDF
        </Button>
      </div>
      <div className="editorjs">
        <Output data={data} style={style} renderers={renderers}/>
      </div>

      {
        audit?.questions?.map((question, index) => (
          <div key={question.uid}>
            <h2 className="inline-block font-heading text-4xl lg:text-5xl">{index + 1 + ". "}{question.name}</h2>
            <hr className="my-4"/>

            <div>
              {
                question?.answers.map((answer, index) => {
                  // Determine if the current answer is selected by checking if there's a matching choice.
                  const isSelected = audit?.choices?.some(choice => choice.answerId === answer.uid);

                  return (
                    <div key={answer.uid}
                         className={`mb-4 rounded-lg border shadow-sm focus:outline-none grid grid-cols-12 space-x-0 space-y-0 w-full ${
                           isSelected ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300'
                         } gap-2 mt-4 gap-y-6 sm:gap-x-4`}>
                      <p className="font-normal block text-sm cursor-pointer col-span-11 py-2.5 px-1.5">
                        {index + 1 + ". "} {answer.name}
                      </p>
                      {isSelected && (
                        <div className="text-green-500 col-span-1 grid place-content-center mr-0.5">
                          <Icons.checkCircle2 size={20}/>
                        </div>
                      )}
                    </div>
                  );
                })
              }
            </div>

            {
              audit?.choices?.map((choice) => (
                <React.Fragment key={choice.answerId}>
                  {choice.questionId === question.uid &&
                      <React.Fragment>
                          <Textarea
                              disabled={true}
                              variant="ny"
                              placeholder="Share your thoughts and additional details..."
                              className="resize-none mb-3"
                              value={choice.additionalNote}
                          />
                        {user?.role === "consultant" && (
                          <>
                            <Editor
                              onSave={() => {
                              }}
                              disable={true}
                              initialData={choice.recommendedNote ? JSON.parse(choice.recommendedNote) : ""}
                              id={`recommendedNote${index}`}
                              placeHolder="Provide your recommended insights and suggestions..."
                            />

                            <Textarea
                              disabled={true}
                              variant="ny"
                              placeholder="Add internal notes or confidential information..."
                              className="resize-none my-3"
                              value={choice.internalNote}
                            />
                          </>
                        )}
                      </React.Fragment>
                  }
                </React.Fragment>
              ))
            }
          </div>
        ))
      }
    </div>
  );
};

export default ReviewComponent;