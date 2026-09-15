import { BookOpen, CalendarDays, HeartHandshake, MessageCircle } from 'lucide-react';

export default function AboutPurpose() {
  return (
    <section className="section-shell about-purpose">
      <span className="section-kicker">हमारे अभियान का उद्देश्य</span>
      <h2>राम नाम लेखन • नाम-स्मरण • साधना • सेवा</h2>
      <p>राम नाम लेखन मन को एकाग्र करने और भक्ति से जोड़ने का सरल माध्यम है। हमारा उद्देश्य अधिक से अधिक लोगों को नियमित साधना, सामूहिक भक्ति और सेवा से जोड़ना है।</p>
      <div className="purpose-grid">
        <span><BookOpen /> प्रतिदिन राम नाम लिखें</span>
        <span><HeartHandshake /> सेवा कार्यों से जुड़ें</span>
        <span><CalendarDays /> नियमित संकल्प निभाएं</span>
        <span><MessageCircle /> अनुभव साझा करें</span>
      </div>
    </section>
  );
}
