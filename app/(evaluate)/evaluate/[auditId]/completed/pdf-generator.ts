import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface EditorJsBlock {
    type: string;
    data: Record<string, any>;
}

const generatePDF = async (editorJsData: { blocks: EditorJsBlock[] }) => {
    const content = await Promise.all (editorJsData.blocks.map(async (block) => {
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
            case 'image':
                const imageData = await loadImage(block.data.url); // Assuming block.data.file.url contains the image URL
                return {image: imageData, width: 200, margin: [0, 10, 0, 10]}; // Set the width as needed
            case 'table':
                return {
                    table: {
                        body: block.data.content.map((row: any[]) => row.map((cell: any) => ({text: cell}))),
                    },
                    margin: [0, 0, 0, 10],
                };
            case 'underline':
                return {text: block.data.text, decoration: 'underline', margin: [0, 0, 0, 10]};
            case 'marker':
                return {text: block.data.text, background: 'yellow', margin: [0, 0, 0, 10]};
            case 'embed':
                return {text: `Embed: ${block.data.embed}`, margin: [0, 0, 0, 10]};
            case 'delimiter':
                return {text: '---------------------', margin: [0, 0, 0, 10]};
            case 'code':
                return {text: block.data.code, font: 'Courier', margin: [0, 0, 0, 10]};
            case 'simple-image':
                return {image: block.data.url, width: 200, height: 200, margin: [0, 0, 0, 10]};

            default:
                return null;
        }
    }));

    const pdfDefinition = {
        content,
    };

    return pdfDefinition
}

// Helper function to load image data asynchronously
const loadImage = async (imageUrl: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            // @ts-ignore
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = canvas.toDataURL('image/*');
            resolve(imageData);
        };
        img.onerror = (error) => reject(error);
        img.src = imageUrl;
    });
};

export default generatePDF;