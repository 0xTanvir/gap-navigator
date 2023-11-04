import Link from "next/link"
import { Icons } from "@/components/icons"
import { siteConfig, siteFooterConfig } from "@/config/site"

export async function CompanyFooter() {
    return (
        <section id="company-footer"
            className="container space-y-6  py-8 dark:bg-transparent md:py-12 lg:py-24"
            aria-labelledby="footer-heading"
        >
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