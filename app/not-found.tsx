import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
    return (
        <section className="relative z-10 flex min-h-screen items-center overflow-hidden py-20 dark:bg-dark lg:py-[120px]">
            <div className="container mx-auto">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4 lg:w-1/2">
                        <div className="mb-12 w-full max-w-[470px] lg:mb-0">
                            <h2 className="mb-6 text-[40px] font-bold uppercase text-primary sm:text-[54px]">
                                404 Error
                            </h2>
                            <h3 className="mb-3 text-2xl font-semibold sm:text-3xl">
                                Oops! The page you are looking for does not exist.
                            </h3>
                            <p className="mb-12 text-lg text-body-color">
                                Uh oh, we can&apos;t seem to find the page you&apos;re looking for,
                                Contact us for more information
                            </p>
                            <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
                                Back to Homepage
                            </Link>
                        </div>
                    </div>

                    <div className="w-full px-4 lg:w-1/2">
                        <div className="mx-auto text-center">
                            <Image
                                src="/images/404.svg"
                                alt="404 image"
                                width="0"
                                height="0"
                                sizes="100vw"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
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

            <div className="absolute left-0 top-0 -z-10 block h-full w-full bg-gray dark:bg-dark-2 lg:w-1/2"></div>
        </section>
    )
}