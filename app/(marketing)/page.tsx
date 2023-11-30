import Link from "next/link"
import Image from "next/image"

import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CompanyFooter } from "@/components/company-footer"

export default async function IndexPage() {
    return (
        <>
            <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                    <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                        Simplify{' '}
                        <span className="relative whitespace-nowrap text-blue-600">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 418 42"
                                className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
                                preserveAspectRatio="none"
                            >
                                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                            </svg>
                            <span className="relative">Audits</span>
                        </span>{' '}
                        , Empower Decisions.
                    </h1>
                    <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                        Your Trusted Platform for Streamlined Audits and Data-Driven Insights.
                    </p>
                    <div className="space-x-4">
                        <Link href="/dashboard" className={cn(buttonVariants({ size: "xl" }), "text-sm font-semibold rounded-full")}>
                            Get Started
                        </Link>
                        <Link
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(buttonVariants({ variant: "outline", size: "xl" }), "text-sm font-semibold rounded-full")}
                        >
                            Audits
                        </Link>
                    </div>
                </div>
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
            </section>
            <section
                id="features"
                className="container space-y-6  py-8 dark:bg-transparent md:py-12 lg:py-24"
            >
                <div
                    className="absolute left-1/2 right-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
                    aria-hidden="true"
                >
                    <div
                        className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                        style={{
                            clipPath:
                                'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
                        }}
                    />
                </div>
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                        Effortless Audits
                    </h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Conduct audits with ease, whether it's on-site or remotely. Create customized assessments tailored to your needs.
                    </p>
                </div>
                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <Icons.users color="#2563EB" className="h-12 w-12 pb-2" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Scalable Account Management</h3>
                                <p className="text-sm">
                                    Start solo or include your entire team. {siteConfig.name} grows with your needs.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <Icons.milestone color="#2563EB" className="h-12 w-12 pb-2" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Comprehensive Audit Control</h3>
                                <p className="text-sm">
                                    Effortlessly create, manage, edit, and archive audits.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <Icons.layoutDashboard color="#2563EB" className="h-12 w-12 pb-2" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Client Interaction Dashboard</h3>
                                <p className="text-sm">
                                    View past and present client audits in one centralized location.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <Icons.filePlus color="#2563EB" className="h-12 w-12 pb-2" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Simplified Audit Creation</h3>
                                <p className="text-sm">
                                    Choose your audit type and name to suit client needs.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <Icons.fileQuestion color="#2563EB" className="h-12 w-12 pb-2" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Customizable Questioning</h3>
                                <p className="text-sm">
                                    Employ multiple-choice questions for deeper insights.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <Icons.report color="#2563EB" className="h-12 w-12 pb-2" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Exclusive Reporting Tools</h3>
                                <p className="text-sm">
                                    Create insightful reports filled with client data and recommendations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto text-center md:max-w-[58rem]">
                    <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Join our platform today and discover a seamless way to
                        conduct audits and transform data into actionable intelligence.
                    </p>
                </div>
            </section>
            <section
                id="collaborative-assessments"
                className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24"
            >
                <div className="mx-auto grid justify-center gap-4 grid-cols-1 md:grid-cols-2 max-w-[64rem]">
                    <div className="md:order-1 order-2 relative overflow-hidden rounded-lg p-2">
                        <div className="flex flex-col justify-between rounded-md p-6">
                            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                                Collaborative Assessments
                            </h2>
                            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                                Consultants can share multiple audits with clients, fostering collaboration and enhancing the audit experience.
                            </p>
                        </div>
                    </div>
                    <div className="md:order-2 order-1 relative overflow-hidden p-2">
                        <Image
                            src="/images/collaborative-assessments.jpg"
                            alt="comparison shopping"
                            width={480}
                            height={270}
                            className="rounded-md bg-muted transition-colors"
                        />
                    </div>
                </div>
            </section>
            <section
                id="data-driven-insights"
                className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24"
            >
                <div
                    className="absolute left-1/2 right-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
                    aria-hidden="true"
                >
                    <div
                        className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                        style={{
                            clipPath:
                                'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
                        }}
                    />
                </div>
                <div className="mx-auto grid justify-center gap-4 grid-cols-1 md:grid-cols-2 max-w-[64rem]">
                    <div className="relative overflow-hidden p-2">
                        <Image
                            src="/images/data-driven-insights.jpg"
                            alt="product search"
                            width={480}
                            height={270}
                            className="rounded-md bg-muted transition-colors"
                        />
                    </div>

                    <div className="relative overflow-hidden rounded-lg p-2">
                        <div className="flex flex-col justify-between rounded-md p-6">
                            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                                Data-Driven Insights
                            </h2>
                            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                                Unlock the power of data with our comprehensive reports. Gain valuable insights to drive informed decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section id="newsletter">
                <div className=" py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="relative isolate overflow-hidden px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
                            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight sm:text-4xl">
                                Get notified when we’re launching.
                            </h2>
                            <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-muted-foreground">
                                Stay in the loop — sign up now to receive updates on our journey to launch, directly to your inbox!
                            </p>
                            <form className="mx-auto mt-10 flex max-w-md gap-x-4">
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <Input type="email" placeholder="Email" />
                                <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                                    Notify me
                                </Link>
                            </form>
                            <svg
                                viewBox="0 0 1024 1024"
                                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
                                aria-hidden="true"
                            >
                                <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
                                <defs>
                                    <radialGradient
                                        id="759c1415-0410-454c-8f7c-9a820de03641"
                                        cx={0}
                                        cy={0}
                                        r={1}
                                        gradientUnits="userSpaceOnUse"
                                        gradientTransform="translate(512 512) rotate(90) scale(512)"
                                    >
                                        <stop stopColor="#7775D6" />
                                        <stop offset={1} stopColor="#E935C1" stopOpacity={0} />
                                    </radialGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </section>
            <CompanyFooter />
        </>
    )
}
