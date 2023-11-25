import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import Link from "@editorjs/link";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header"
import Table from "@editorjs/table"
import Marker from "@editorjs/marker"
import Underline from "@editorjs/underline"
import SimpleImage from "@editorjs/simple-image"

export const EditorTools = {
    code: Code,
    header: {
        class: Header,
        inlineToolbar: true,
    },
    paragraph: {
        class: Paragraph,
        inlineToolbar: true
    },
    checklist: CheckList,
    embed: {
        class: Embed,
        inlineToolbar: true,
        config: {
            services: {
                youtube: true,
                facebook: true,
                twitter:true,
                instagram:true,
            }
        }
    },
    image: {
        class: Image,
        // config: {
        //     endpoints: {
        //         byFile: 'http://localhost:3000/uploadFile', // Your backend file uploader endpoint
        //         byUrl: 'http://localhost:3000/fetchUrl', // Your endpoint that provides uploading by Url
        //     }
        // }
    },
    simpleImage: {
        class:SimpleImage,
        inlineToolbar:true
    },
    link: {
        class: Link,
        inlineToolbar: true,
        isInline: true
    },
    list: {
        class: List,
        inlineToolbar: true
    },
    quote: Quote,
    delimiter: Delimiter,
    table: Table,
    marker: {
        class: Marker,
        inlineToolbar: true
    },
    underline: {
        class: Underline,
        inlineToolbar: true
    },
}