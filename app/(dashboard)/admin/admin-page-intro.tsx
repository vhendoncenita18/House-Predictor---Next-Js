type AdminPageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AdminPageIntro({ eyebrow, title, description }: AdminPageIntroProps) {
  return (
    <section className="space-y-3">
      <p className="text-sm uppercase tracking-[0.3em] text-white/45">{eyebrow}</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="max-w-3xl text-sm text-white/65 sm:text-base">{description}</p>
    </section>
  );
}
