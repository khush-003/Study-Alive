import InfoCard from './InfoCard.jsx';

export default function CoursesRoadmapTab({ career }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-base font-bold text-content-title">Recommended Degrees &amp; Pathways</h3>
        <p className="mt-1 text-xs text-content-muted">Explore education routes that can lead to this career.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {career.degreePaths.map((path, index) => <InfoCard key={path} label={`Pathway ${index + 1}`} value={path} icon="faGraduationCap" />)}
      </div>
      <InfoCard label="Core skills to develop" value={career.requiredSkills} icon="faLightbulb" />
    </div>
  );
}
