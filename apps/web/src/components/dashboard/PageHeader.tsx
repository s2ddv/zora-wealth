interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header>
      <p className="text-label-caps uppercase text-on-surface-variant">{eyebrow}</p>
      <h1 className="text-headline-lg font-bold text-on-surface">{title}</h1>
      <p className="mt-1 text-body-base text-on-surface-variant">{description}</p>
    </header>
  );
}
