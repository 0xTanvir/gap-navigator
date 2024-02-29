import CheckList from "@editorjs/checklist";
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
import LinkAutocomplete from "@editorjs/link-autocomplete"
import Strikethrough from '@sotaproject/strikethrough';
import ChangeCase from 'editorjs-change-case';
import InlineCode from '@editorjs/inline-code';
import Warning from '@editorjs/warning';
import "@/styles/editor.css"
import { getDownloadURL, getStorage, ref, uploadBytes } from "@firebase/storage";
import { Timestamp } from "firebase/firestore";

export const EditorTools = {
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
    class: Image,
    config: {
      types: 'image/png, image/jpeg, image/jpg',
      accept: '.png, .jpg, .jpeg',
      uploader: {
        async uploadByFile(file: any) {
          try {
            const storage = getStorage();
            const storageRef = ref(storage, `editorjs/images/${Timestamp.now()}_${file.name}`); // Customize your path
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            // Assuming the success structure for Editor.js needs a URL and success status
            return {success: 1, file: {url: downloadURL}};
          } catch (error) {
            console.error("Upload failed", error);
            // Handle upload error
            return {success: 0};
          }
        },
        // async uploadByFile(file: any) {
        //   const formData = new FormData()
        //   formData.append('file', file)
        //   const response = await fetch('/api/create', {
        //       method: 'POST',
        //       headers: {
        //         // 'Accept': 'application.json',
        //         'Content-Type': 'multipart/form-data',
        //       },
        //       body: JSON.stringify(formData),
        //       credentials: "same-origin"
        //     }
        //   )
        //   const res = await response.json()
        //   if (res.data.success === 1) {
        //     return res.data
        //   }
        // },
        // async uploadByUrl(url: string) {
        //   const response = await fetch('', {
        //     method: 'POST',
        //     headers: {
        //       'Accept': 'application.json',
        //     },
        //     body: JSON.stringify(url),
        //     credentials: "same-origin"
        //   })
        //   const res = await response.json()
        //   if (res.data.success === 1) {
        //     return res.data
        //   }
        // }
      }
    },
    inlineToolbar: true
  },
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
  warning: {
    class: Warning,
    inlineToolbar: true,
    config: {
      titlePlaceholder: 'Title',
      messagePlaceholder: 'Message',
    },
  },
  strikethrough: Strikethrough,
  changeCase: ChangeCase,
  inlineCode: InlineCode
}