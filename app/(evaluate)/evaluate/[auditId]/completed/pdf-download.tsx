"use client"
import React, {useEffect} from 'react';
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";
import pdfMake from "pdfmake/build/pdfmake";
import {Content, TDocumentDefinitions} from "pdfmake/interfaces";
import pdfFonts from "pdfmake/build/vfs_fonts"
import {generateRandomText} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import htmlToPdfmake from "html-to-pdfmake"
import edjsParser from "editorjs-parser";
import {DocsPageHeader} from "@/app/(evaluate)/preview/page-header";
import Output from "editorjs-react-renderer";
import {CodeBlockRenderer, ImageBlock, style} from "@/components/editorjs/editorjs-utils";
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


    const generateAndDownloadPdf = async () => {
        try {
            if (!evaluation || !evaluation.evaluate) {
                throw new Error('Invalid evaluation data');
            }

            const evaluationChoiceRecommendedNote = (evaluation?.evaluate?.choices?.filter(choice => choice.recommendedNote) || [])
                .flatMap(item => JSON.parse(item?.recommendedNote ?? '[]'));

            let reportData = (evaluationFormatData.filter(data => data.recommendationDocument) || [])
                .flatMap(item => JSON.parse(item?.recommendationDocument ?? '[]'));

            // reportData = [...reportData, ...evaluationChoiceRecommendedNote]
            console.log(reportData)

            let data = {
                blocks: reportData
            };
            console.log(data)

            const markup = parser.parse(data);
            let html = htmlToPdfmake(markup)

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
                    bold: true,
                    italics: false
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
            </div>
        </>
    );
};

export default PdfDownload;