import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'
// import { Spotify } from '@/components/ui/svgs/spotify'
// import { SupabaseFull } from '@/components/ui/svgs/supabase'
// import { Hulu } from '@/components/ui/svgs/hulu'
// import { Bolt } from '@/components/ui/svgs/bolt'
// import { FirebaseFull } from '@/components/ui/svgs/firebase'
// import { Beacon } from '@/components/ui/svgs/beacon'
// import { Claude } from '@/components/ui/svgs/claude'
// import { VercelFull } from '@/components/ui/svgs/vercel'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
} as const

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">

                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                        />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="/login"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">AI-Powered House Price Predictions</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedGroup>

                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                    Predict House Prices with Advanced AI
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                    Get accurate real estate valuations instantly using machine learning. Analyze properties, compare markets, and make informed investment decisions.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="/login">
                                                <span className="text-nowrap">Get Started</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <Link href="#link">
                                            <span className="text-nowrap">Learn More</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                    
                    </div>
                </section>
                <section className="bg-background py-16 md:py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                            <p className="text-foreground/60 max-w-2xl mx-auto">Follow these simple steps to get accurate house price predictions</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.1,
                                                delayChildren: 0.2,
                                            },
                                        },
                                    },
                                    item: {
                                        hidden: {
                                            opacity: 0,
                                            y: 20,
                                        },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                type: 'spring',
                                                bounce: 0.3,
                                                duration: 0.8,
                                            },
                                        },
                                    },
                                }}
                                className="contents">
                                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-8 hover:bg-foreground/10 transition-colors duration-300">
                                    <div className="text-4xl font-bold text-primary mb-4">1</div>
                                    <h3 className="text-xl font-semibold mb-3">Enter Property Details</h3>
                                    <p className="text-foreground/60">Input key information about the property including location, size, bedrooms, bathrooms, and other features.</p>
                                </div>
                                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-8 hover:bg-foreground/10 transition-colors duration-300">
                                    <div className="text-4xl font-bold text-primary mb-4">2</div>
                                    <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                                    <p className="text-foreground/60">Our advanced machine learning model analyzes market trends, comparable properties, and historical data.</p>
                                </div>
                                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-8 hover:bg-foreground/10 transition-colors duration-300">
                                    <div className="text-4xl font-bold text-primary mb-4">3</div>
                                    <h3 className="text-xl font-semibold mb-3">Get Prediction</h3>
                                    <p className="text-foreground/60">Receive an accurate price estimate with confidence intervals and detailed market insights in seconds.</p>
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <Link
                                href="/"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span> Meet Our Customers</span>

                                <ChevronRight className="ml-1 inline-block size-3" />
                            </Link>
                        </div>
                        <div className="group-hover:blur-xs **:fill-foreground mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14 md:grid-cols-4">
                            {/* <div className="flex items-center">
                                <Bolt className="mx-auto h-5 w-full" />
                            </div>
                            <div className="flex items-center">
                                <VercelFull className="mx-auto h-4 w-full" />
                            </div>
                            <div className="flex items-center">
                                <SupabaseFull className="mx-auto h-6" />
                            </div>
                            <div className="flex items-center">
                                <Hulu className="mx-auto h-4 w-full" />
                            </div>
                            <div className="flex items-center">
                                <Spotify className="mx-auto h-6 w-full" />
                            </div>
                            <div className="flex items-center">
                                <FirebaseFull className="mx-auto h-6 w-full" />
                            </div>
                            <div className="flex items-center">
                                <Beacon className="mx-auto h-4 w-full" />
                            </div>

                            <div className="flex items-center">
                                <Claude className="mx-auto h-5 w-full" />
                            </div> */}
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
