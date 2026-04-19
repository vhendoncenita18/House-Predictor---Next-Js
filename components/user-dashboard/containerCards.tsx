

export const sectionCardClassName =
    "rounded-[1.75rem] border border-white/10 bg-[#141414]/88 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-6 lg:p-8";

export const railClassName =
    " flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export const itemCardClassName =
    "group flex min-w-[260px] snap-start flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-left shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] sm:min-w-[300px] sm:p-5 xl:min-w-[250px]";

export const pesoFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
});


export function scrollCards(ref: { current: HTMLDivElement | null }, direction: "left" | "right") {
    const element = ref.current;

    if (!element) {
        return;
    }

    const offset = Math.max(element.clientWidth * 0.8, 280);

    element.scrollBy({
        left: direction === "left" ? -offset : offset,
        behavior: "smooth",
    });
}