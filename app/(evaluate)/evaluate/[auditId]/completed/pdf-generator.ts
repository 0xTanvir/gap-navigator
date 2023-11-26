import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface EditorJsBlock {
    type: string;
    data: Record<string, any>;
}

const generatePDF = (editorJsData: { blocks: EditorJsBlock[] }) => {
    const content = (editorJsData.blocks.map( (block) => {
        switch (block.type) {
            case 'paragraph':
                return {text: block.data.text, margin: [0, 0, 0, 10]};
            case 'header':
                const headerLevel = block.data.level || 1; // Default to level 1 if level is not provided
                let fontSize;
                switch (headerLevel) {
                    case 1:
                        fontSize = 32;
                        break;
                    case 2:
                        fontSize = 24;
                        break;
                    case 3:
                        fontSize = 18.72;
                        break;
                    case 4:
                        fontSize = 15.84;
                        break;
                    case 5:
                        fontSize = 13.28;
                        break;
                    case 6:
                        fontSize = 10.72;
                        break;
                    default:
                        fontSize = 16 + (6 - headerLevel) * 2;
                }
                return {
                    text: block.data.text,
                    fontSize,
                    bold: true,
                    margin: [0, 10, 0, 10],
                };
            case 'list':
                return {ul: block.data.items, margin: [0, 0, 0, 10]};
            case 'checklist':
                return {ul: block.data.items, margin: [0, 0, 0, 10]};
            default:
                return null;
        }
    }));

    const pdfDefinition = {
        content,
    };
    return pdfDefinition
}

export default generatePDF;