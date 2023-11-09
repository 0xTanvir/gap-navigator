import {Icons} from "@/components/icons";
import ContactForm from "@/components/contact/contact-form";

export default async function ContactPage() {
    return (
        <div className="container pb-8 pt-6 md:py-10">
            <div className="relative isolate ">
                <div className=" grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                    <div className="relative pb-24 lg:static ">
                        <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                            <h2 className="text-3xl font-bold tracking-tight ">Get in touch</h2>
                            <p className="mt-6 text-lg leading-8 ">
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
            </div>
        </div>
    )
}