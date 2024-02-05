import { Icons } from "@/components/icons"
import ContactForm from "@/components/contact/contact-form"
import { CompanyFooter } from "@/components/company-footer"
import { MainNav } from "@/components/nav/main-nav";
import { dashboardConfig } from "@/config/dashboard";
import { ProfileNav } from "@/components/nav/profile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationComponent from "@/components/marketing/notification-component";
import React from "react";

export default async function ContactPage() {
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
      <section className="relative isolate">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                Get in touch
              </h2>
              <p className=" mt-2 max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Proin volutpat consequat porttitor cras nullam gravida at. Orci molestie a eu arcu. Sed
                ut tincidunt
                integer elementum id sem. Arcu sed malesuada et magna.
              </p>
              <dl className="mt-10 space-y-4 text-base leading-7">
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Address</span>
                    <Icons.building/>
                  </dt>
                  <dd>
                    545 Mavis Island
                    <br/>
                    Chicago, IL 99191
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Telephone</span>
                    <Icons.phone/>
                  </dt>
                  <dd>
                    <a className="hover:text-gray-900" href="tel:+1 (555) 234-5678">
                      +1 (555) 234-5678
                    </a>
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Email</span>
                    <Icons.mail/>
                  </dt>
                  <dd>
                    <a className="hover:text-gray-900" href="mailto:hello@example.com">
                      hello@example.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <ContactForm/>
        </div>
      </section>
      <CompanyFooter/>
    </>
  )
}