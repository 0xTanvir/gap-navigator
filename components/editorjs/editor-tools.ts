import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header"
import Table from "@editorjs/table"
import Marker from "@editorjs/marker"
import Underline from "@editorjs/underline"
import SimpleImage from "@editorjs/simple-image"
import LinkAutocomplete from "@editorjs/link-autocomplete"
import Strikethrough from '@sotaproject/strikethrough';
import ChangeCase from 'editorjs-change-case';
import InlineCode from '@editorjs/inline-code';
import "@/styles/editor.css"

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
    checklist: {
        class: CheckList,
        inlineToolbar: true
    },
    embed: {
        class: Embed,
        inlineToolbar: false,
        config: {
            services: {
                youtube: true,
                facebook: true,
                twitter: true,
                instagram: true,
            }
        }
    },
    image: {
        class: SimpleImage,
        inlineToolbar: false
    },
    // image: {
    //     class: Image,
    //     config: {
    //         uploader: {
    //             async uploadByFile(file: any) {
    //                 const formData = new FormData()
    //                 formData.append('file', file)
    //                 const response = await fetch('/api/create', {
    //                         method: 'POST',
    //                         headers: {
    //                             // 'Accept': 'application.json',
    //                             'Content-Type': 'multipart/form-data',
    //                         },
    //                         body: JSON.stringify(formData),
    //                         credentials: "same-origin"
    //                     }
    //                 )
    //                 const res = await response.json()
    //                 if (res.data.success === 1) {
    //                     return res.data
    //                 }
    //             },
    //             async uploadByUrl(url: string) {
    //                 const response = await fetch('', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Accept': 'application.json',
    //                     },
    //                     body: JSON.stringify(url),
    //                     credentials: "same-origin"
    //                 })
    //                 const res = await response.json()
    //                 if (res.data.success === 1) {
    //                     return res.data
    //                 }
    //             }
    //         }
    //     }
    // },
    // simpleImage: {
    //     class:SimpleImage,
    //     inlineToolbar:false
    // },
    link: {
        class: LinkAutocomplete,
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
    strikethrough: Strikethrough,
    changeCase: ChangeCase,
    inlineCode: InlineCode
}