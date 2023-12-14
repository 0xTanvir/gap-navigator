export const editorToHTML = {

    methods: {
        makeParagraph(obj: any) {
            return `<p class="blog_post_text">
                        ${obj.data.text}    
                    </p>`

        },
        makeImage(obj: any) {
            const caption = obj.data.caption ? `<div class="blog_caption">
                                <p>${obj.data.caption}</p>
                            </div>` : ''
            return `<div class="blog_image">
                                <img src="${obj.data.url}" alt="${obj.data.caption}"/>
                                ${caption} 
                        </div>`


        },
        makeEmbed(obj: any) {
            const caption = obj.data.caption ? `<div class="list_item_btm_text">
                   <p class="nws3_text1"> ${obj.data.caption}</p>
               </div>` : ''
            return `<section class="nws3_sec4">
                    <div class="row justify-content-center">
                        <div class="col-12 col-md-10 col-lg-8">

                            <div class="list_item_btm">
                                    <div class="list_item_btm_img">
                                    <iframe width="730" height="415" src="${obj.data.embed}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                    ${caption}
                                </div>


                        </div>
                    </div>
                </section>`

        },
        makeHeader(obj: any) {
            return `<h${obj.data.level} class="blog_post_h${obj.data.level}">${obj.data.text}</h${obj.data.level}>`


        },
        makeCode(obj: any) {
            return `<section class="nws3_sec4">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-10 col-lg-8">

                       <div class="news_code">
                            <pre>
                                <code class="html">
                                ${obj.data.code}
                                </code>
                             </pre>
                        </div>
                    </div>
                </div>
            </section>	`

        },
        makeList(obj: any) {
            if (obj.data.style === 'unordered') {
                const list = obj.data.items.map((item: any) => {
                    return `<li class="cdx-list__item">${item}</li>`;
                });
                return `<ul class="cdx-block cdx-list cdx-list--unordered">
                            ${list.join('')}
                        </ul>`;

            } else {
                const list = obj.data.items.map((item: any) => {
                    return `<li class="cdx-list__item">${item}</li>`;
                });
                return `<ol class="cdx-block cdx-list cdx-list--ordered">
                            ${list.join('')}
                        </ol>`
            }


        },
        makeQuote(obj: any) {
            return `<div class="spcl_line mar_b30">
                        <blockquote>
                            <p class="spcl_line_p">
                                ${obj.data.text}
                            </p>
                        </blockquote>
                        <p>- ${obj.data.caption}</p>
                    </div>`

        },
        makeWarning(obj: any) {
            return `<section class="nws3_sec4">
            <div class="row justify-content-center">
                <div class="col-12 col-md-10 col-lg-8">
                    <div class="table_warning">
                        
                        <h3><span><i class="fas fa-exclamation"></i></span>${obj.data.title}</h3>
                        <p>${obj.data.message}</p>
                    </div>
                </div>
            </div>
        </section>	`
        },
        makeChecklist(obj: any) {
            const list = obj.data.items.map((item: { text: any }) => {
                return `<div class="cdx-checklist__item">
                        <div class="cdx-checklist__item-checkbox">
                           <span class="cdx-checklist__item-checkbox-check"></span>
                        </div>
                        <div class="cdx-checklist__item-text" contenteditable="true">
                            ${item.text}
                        </div>
                </div>`;
            });
            return `<div class="ce-block ce-block--focused">
                        <div class="ce-block__content">
                            <div class="cdx-block cdx-checklist">
                                    ${list.join('')}
                            </div>
                        </div>
                    </div>	`;

        },
        makeDelimeter(obj: any) {
            return `<div class="ce-block">
            <div class="ce-block__content">
                <div class="ce-delimiter cdx-block"></div>
            </div>
            </div>\n`
        },


    }
}