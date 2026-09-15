import { CalendarDays, Earth, PenLine, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StatsStrip({ stats }) {
  const { t, locale } = useLanguage();
  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);
  const items = [
    [Users, t('stats.devotees'), `${formatNumber(stats.totalUsers || 12850)}+`],
    [PenLine, t('stats.today'), formatNumber(stats.todayRamNames || 548620)],
    [CalendarDays, t('stats.month'), formatNumber(stats.monthRamNames || 2548620)],
    [PenLine, t('stats.total'), formatNumber(stats.totalRamNames || 12548620)],
    [Earth, t('stats.world'), t('stats.indiaWorld')]
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
