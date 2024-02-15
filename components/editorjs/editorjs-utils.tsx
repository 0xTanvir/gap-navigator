import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {docco} from "react-syntax-highlighter/dist/esm/styles/hljs";

export const CodeBlockRenderer = ({data}: any) => {
    try {
        return <SyntaxHighlighter language="javascript" style={docco}>
            {data?.code}
        </SyntaxHighlighter>;
    } catch (error) {
        console.error('Error rendering code block:', error);
        return <div>Error: Unable to render code block</div>;
    }
};

// All valid JSX inline styles are allowed
export const style = {
    paragraph: {
        margin: "8px 0",
        fontSize: "18px",
        lineHeight: "1.7",
        fontWeight: 200,
        textAlign: "justify"
    },
    header: {
        h1: {
            display: "block",
            fontSize: "2em",
            marginBlockStart: "0.67em",
            marginBlockEnd: "0.67em",
            marginInlineStart: 0,
            marginInlineEnd: 0,
            fontWeight: "bold",
        },
        h2: {
            display: "block",
            fontSize: "1.5em",
            marginBlockStart: "0.83em",
            marginBlockEnd: "0.83em",
            marginInlineStart: 0,
            marginInlineEnd: 0,
            fontWeight: "bold",
        },
        h3: {
            display: "block",
            fontSize: "1.17em",
            marginBlockStart: "1.0em",
            marginBlockEnd: "1.0em",
            marginInlineStart: 0,
            marginInlineEnd: 0,
            fontWeight: "bold",
        },
        h4: {
            marginBlockStart: "1.33em",
            marginBlockEnd: "1.33em",
            marginInlineStart: 0,
            marginInlineEnd: 0,
            display: "block",
            fontWeight: "bold",
        },
        h5: {
            marginBlockStart: "1.67em",
            marginBlockEnd: "1.67em",
            marginInlineStart: 0,
            marginInlineEnd: 0,
            display: "block",
            fontWeight: "bold",
        },
        h6: {
            marginBlockStart: "2.33em",
            marginBlockEnd: "2.33em",
            marginInlineStart: 0,
            marginInlineEnd: 0,
            display: "block",
            fontWeight: "bold",
            margin: "15px 0px 8px",
        },
    },
    image: {
        img: {
            maxWidth: "100%",
            height: "auto",
            borderRadius: "4px",
        },
        figure: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px 0px",
            width: "100%",
            maxWidth: "100%",
            maxHeight: "400px",
            overflow: "hidden",
            border: "none",
        },
        figcaption: {
            fontSize: "0.8em",
            textAlign: "center",
            marginTop: "4px",
        },
    },
    figure: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px 0px",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "400px",
        overflow: "hidden",
        border: "none",
    },
    video: {
        video: {
            maxWidth: "100%",
            height: "auto",
            borderRadius: "4px",
        },
        figure: {
            margin: "20px 0",
        },
        figcaption: {
            fontSize: "0.8em",
            textAlign: "center",
            marginTop: "4px",
        }
    },
    embed: {
        video: {
            maxWidth: "100%",
            height: "auto",
            borderRadius: "4px",
        },
        figure: {
            margin: "20px 0",
        },
        figcaption: {
            fontSize: "0.8em",
            textAlign: "center",
            marginTop: "4px",
        },
    },
    list: {
        container: {
            display: "block",
            margin: "1em 0",
            paddingLeft: "40px",
        },
        listItem: {
            marginBottom: "0.5em",
            display: "list-item"
        },
    },
    checklist: {
        container: {
            margin: "1em 0",
            paddingLeft: "40px",
        },
        item: {
            marginBottom: "0.5em",
        },
        checkbox: {
            marginRight: "0.5em",
        },
        label: {
            fontSize: "1em",
            verticalAlign: "middle",
        },
    },
    table: {
        table: {
            width: "100%",
            borderCollapse: "collapse",
            margin: "1em 0",
            fontSize: "14px",
            borderWidth: "1px",
            borderSpacing: "2px",
        },
        thead: {
            display: "table-header-group",
            verticalAlign: "middle",
            borderColor: "inherit",
        },
        tbody: {
            display: "table-row-group",
            verticalAlign: "middle",
            borderColor: "inherit",
        },
        tr: {
            borderBottom: "1px solid #ddd",
            backgroundColor: "transparent",
            display: "table-row",
            verticalAlign: "inherit",
            borderColor: "inherit",
        },
        th: {
            padding: "8px",
            textAlign: "left",
            fontWeight: "bold",
            borderWidth: "1px",
            backgroundColor: "transparent",
            display: "table-cell",
            verticalAlign: "inherit",
        },
        td: {
            padding: "8px",
            textAlign: "left",
            borderWidth: "1px",
            display: "table-cell",
            verticalAlign: "inherit",
        },
    },
    quote: {
        container: {
            margin: "1em 0",
            padding: "1em",
            borderLeft: "4px solid #ccc",
        },
        content: {
            fontSize: "1em",
            fontStyle: "italic",
        },
        author: {
            marginTop: "0.5em",
            fontSize: "0.9em",
            fontWeight: "bold",
        },
        message: {
            marginTop: "0.5em",
            fontSize: "1.2em",
        },
    },
    codeBox: {
        container: {
            margin: "1em 0",
            padding: "1em",
            backgroundColor: "#f7f7f7",
            borderRadius: "5px",
        },
        code: {
            fontFamily: "monospace",
            fontSize: "14px",
            color: "#333",
        },
    },
    code: {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#333",
        whiteSpace: "pre-wrap"
    },
    warning: {
        container: {
            margin: '20px 8px',
        },
        icon: {
            width: "30px"
        },
        title: {
            fontWeight: 400,
            textTransform: "uppercase",
            margin: "0px 10px 0px 5px",
            fontSize: "90%",
        },
        message: {
            color: "goldenrod",
            fontSize: "90%",
            margin: "0px",
            textAlign: "left",
        },
    },
    delimiter: {
        container: {
            margin: "8px 0",
            textAlign: 'center',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }
    },
    personality: {
        container: {
            margin: "1em 0",
        },
        textHolder: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        name: {
            fontSize: "1.2em",
            fontWeight: "bold",
        },
        description: {
            fontSize: "1em",
        },
        photo: {
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            margin: "0.5em 0",
        },
        link: {
            fontSize: "0.9em",
            textDecoration: "underline",
            cursor: "pointer",
        },
    },
    linkTool: {
        container: {
            margin: "1em 0",
        },
        textHolder: {
            display: "flex",
            flexDirection: "column",
        },
        title: {
            fontSize: "1.2em",
            fontWeight: "bold",
        },
        description: {
            fontSize: "1em",
        },
        image: {
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            marginTop: "0.5em",
        },
        siteName: {
            fontSize: "0.9em",
        },
    },

};