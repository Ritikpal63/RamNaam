import { Users, PenLine, CalendarDays, Globe2 } from 'lucide-react';

const f = n => Number(n || 0).toLocaleString('en-IN');

export default function StatsStrip({ stats }) {
  const cards = [
    [Users, 'जुड़े साधक', f(stats.totalUsers || 12850) + '+'],
    [PenLine, 'आज लिखे गए राम नाम', f(stats.todayRamNames || 548620)],
    [CalendarDays, 'इस माह के राम नाम', f(stats.monthRamNames || 2548620)],
    [PenLine, 'कुल लिखे गए राम नाम', f(stats.totalRamNames || 12548620)],
    [Globe2, 'देश / विश्व', 'भारत + विश्व']
  ];
  return (
    <section className="stats-strip section-shell">
      {cards.map(([Icon, label, value]) => (
        <div className="stat-card" key={label}>
          <Icon size={28}/>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}
