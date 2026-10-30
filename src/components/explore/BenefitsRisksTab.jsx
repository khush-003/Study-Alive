function CareerList({ title, items, tone }) {
  const styles = tone === 'positive'
    ? 'border-emerald-100 bg-emerald-50/50 text-emerald-900'
    : 'border-amber-100 bg-amber-50/50 text-amber-900';
  return (
    <section className={`rounded-2xl border p-4 ${styles}`}>
      <h3 className="font-display text-base font-bold">{title}</h3>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6">{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

export default function BenefitsRisksTab({ career }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CareerList title="Key Advantages" items={career.pros} tone="positive" />
      <CareerList title="Considerations & Risks" items={career.risks} tone="caution" />
    </div>
  );
}
