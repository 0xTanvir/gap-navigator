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
    embed: Embed,
    image: Image,
    link: {
        class: Link,
        inlineToolbar: true
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