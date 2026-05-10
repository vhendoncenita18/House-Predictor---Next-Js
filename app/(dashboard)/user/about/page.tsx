"use client";

import { HeroHeader } from "@/components/header";
import StrengthCard from "./strengths";
import AboutPart from "./aboutPart";
import GuidelinesCard from "./guidelines";

export default function UserAboutPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#090909] text-white">
            <HeroHeader />

            <div
                aria-hidden
                className="absolute inset-0 isolate hidden opacity-90 contain-strict lg:block"
            >
                <div className="absolute left-0 top-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,100%,.12)_0,hsla(0,0%,75%,.04)_45%,hsla(0,0%,45%,0)_80%)]" />
                <div className="absolute left-0 top-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,100%,.08)_0,hsla(0,0%,60%,.03)_80%,transparent_100%)]" />
                <div className="absolute left-0 top-0 h-320 w-60 -translate-y-87.5 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,100%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
            </div>

            <div
                aria-hidden
                className="absolute inset-0 -z-10 size-full bg-[radial-gradient(120%_120%_at_50%_100%,#171717_0%,#090909_58%,#050505_100%)]"
            />

            <main className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:gap-10 lg:px-8 lg:pt-36">
                
                <AboutPart />
                
                <StrengthCard />

                <GuidelinesCard />
            </main>
        </div>
    );
}
