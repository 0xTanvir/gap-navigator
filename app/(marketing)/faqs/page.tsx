import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "@/config/site"
import { CompanyFooter } from "@/components/company-footer"
import { MainNav } from "@/components/nav/main-nav";
import { dashboardConfig } from "@/config/dashboard";
import { ProfileNav } from "@/components/nav/profile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationComponent from "@/components/marketing/notification-component";
import React from "react";

export default async function FAQsPage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-20 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav}/>
          <nav className="flex gap-2 items-center">
            <ProfileNav/>
            <ModeToggle/>
            <NotificationComponent/>
          </nav>
        </div>
      </header>
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Frequently asked questions
          </h1>
          <div className="mt-10 ">
            {faqs.map((faq) => (
              <Accordion key={faq.question} type="single" collapsible>
                <AccordionItem value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
      <CompanyFooter/>
    </>
  )
}