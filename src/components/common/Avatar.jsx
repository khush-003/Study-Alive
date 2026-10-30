/**
 * Props: name (string), src (image URL), size (pixel number).
 * Usage: <Avatar name="Aanya Sharma" src={student.avatar} size={48} />
 */
export default function Avatar({ name = '', src = '', size = 36 }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || '?';
  return src
    ? <img src={src} alt={name} width={size} height={size} className="inline-flex shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
    : <span aria-label={name || 'Guest'} className="gradient-brand inline-flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ width: size, height: size }}>{initials}</span>;
}
