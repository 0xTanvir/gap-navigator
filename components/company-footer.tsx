import Link from "next/link"
import { Icons } from "@/components/icons"
import { siteConfig, siteFooterConfig } from "@/config/site"

export async function CompanyFooter() {
    return (
        <section id="company-footer"
            className="container space-y-6  py-8 dark:bg-transparent md:py-12 lg:py-24"
            aria-labelledby="footer-heading"
        >
            <svg aria-hidden="true" width="100%" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
                    <g >
                        <path d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0" stroke="#E1E3E1">
                        </path>
                    </g>
                </pattern>
                <rect width="100%" height="100%" fill="url(#a)">
                </rect>
            </svg>
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="flex flex-col gap-8">
                        <Link href="/" className="flex gap-2">
                            <Icons.logo />
                            <span className=" font-bold sm:inline-block">
                                {siteConfig.name}
                            </span>
                        </Link>
                        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                            At {siteConfig.name}, Our platform is designed to make audits a breeze and 
                            provide you with actionable insights.
                        </p>
                        <h3 className="font-bold">Follow Us On</h3>
                        <div className="flex gap-4">
                            <Link href="/">
                                <Icons.facebook />
                            </Link>
                            <Link href="/">
                                <Icons.twitter />
                            </Link>
                            <Link href="/">
                                <Icons.youtube />
                            </Link>
                            <Link href="/">
                                <Icons.linkedin />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="font-bold">Solutions</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {siteFooterConfig.solutions.map((item) => (
                                        <li key={item.title}>
                                            <Link href={item.disabled ? "/" : item.href} className="text-sm text-muted-foreground">
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="font-bold">Support</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {siteFooterConfig.support.map((item) => (
                                        <li key={item.title}>
                                            <Link href={item.disabled ? "/" : item.href} className="text-sm text-muted-foreground">
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="font-bold">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {siteFooterConfig.company.map((item) => (
                                        <li key={item.title}>
                                            <Link href={item.disabled ? "/" : item.href} className="text-sm text-muted-foreground">
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="font-bold">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {siteFooterConfig.legal.map((item) => (
                                        <li key={item.title}>
                                            <Link href={item.disabled ? "/" : item.href} className="text-sm text-muted-foreground">
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}