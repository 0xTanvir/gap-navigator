import FaqsAccordion from "@/components/faqs/faqs-accordion";

export default async function FaqPage() {
    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight">
                Frequently asked questions
            </h2>
            <FaqsAccordion/>
        </section>
    )
}