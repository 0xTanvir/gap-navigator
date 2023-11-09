"use client"
import React from 'react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

const faqs = [
    {
        question: "What's the best thing about Switzerland?",
        answer:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    }, {
        question: "What's the best thing about Switzerland?",
        answer:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    }, {
        question: "What's the best thing about Switzerland?",
        answer:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    }, {
        question: "What's the best thing about Switzerland?",
        answer:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    }, {
        question: "What's the best thing about Switzerland?",
        answer:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
]
const FaqsAccordion = () => {
    return (
        <Accordion type="multiple" className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem value={String(index)}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default FaqsAccordion;