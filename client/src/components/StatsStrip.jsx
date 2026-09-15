import { CalendarDays, Earth, PenLine, Users } from 'lucide-react';

const formatNumber = (value) => Number(value || 0).toLocaleString('en-IN');

export default function StatsStrip({ stats }) {
  const items = [
    [Users, 'जुड़े साधक', `${formatNumber(stats.totalUsers || 12850)}+`],
    [PenLine, 'आज लिखे गए राम नाम', formatNumber(stats.todayRamNames || 548620)],
    [CalendarDays, 'इस माह के राम नाम', formatNumber(stats.monthRamNames || 2548620)],
    [PenLine, 'कुल लिखे गए राम नाम', formatNumber(stats.totalRamNames || 12548620)],
    [Earth, 'देश / विश्व', 'भारत + विश्व']
  ];

  return (
    <section className="stats-strip section-shell">
      {items.map(([Icon, label, value]) => (
        <div className="stat-card" key={label}>
          <Icon size={28} />
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}
