import {
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Music2,
  Trees,
  Wheat,
  Stethoscope,
  GraduationCap,
  // Cow,
  Images,
  MessageCircle,
  Newspaper,
} from "lucide-react";

export function DailySadhana() {
  return (
    <section id="sadhana" className="section-shell content-row">
      <article className="panel illustrated-card">
        <div>
          <span className="section-kicker">दैनिक साधना</span>
          <h2>हर दिन भक्ति के लिए कुछ समय</h2>
          <ul>
            <li>श्री राम नाम</li>
            <li>हनुमान चालीसा</li>
            <li>राम मंत्र-जाप</li>
            <li>सुंदरकांड पाठ</li>
            <li>भजन एवं ध्यान</li>
          </ul>
        </div>
        <div className="symbol-circle">🚩</div>
      </article>
      <article id="events" className="panel event-card">
        <div className="panel-title">📅 आज के कार्यक्रम</div>
        {[
          ["25", "सामूहिक राम नाम लेखन", "सुबह 06:00 - 08:00"],
          ["25", "सुंदरकांड पाठ", "दोपहर 03:00 - 05:00"],
          ["26", "हनुमान चालीसा पाठ", "शाम 07:00 - 08:00"],
        ].map((e) => (
          <div className="event-row" key={e[1]}>
            <b>
              {e[0]}
              <small>सित.</small>
            </b>
            <span>
              <strong>{e[1]}</strong>
              <small>{e[2]} • ऑनलाइन</small>
            </span>
          </div>
        ))}
      </article>
    </section>
  );
}

export function Seva() {
  const items = [
    [Wheat, "अन्न सेवा"],
    // [Cow, "गौ सेवा"],
    [GraduationCap, "शिक्षा सेवा"],
    [Stethoscope, "चिकित्सा सहायता"],
    [Trees, "वृक्षारोपण"],
    [HeartHandshake, "अन्य सेवा"],
  ];
  return (
    <section id="seva" className="section-shell panel seva">
      <div className="section-heading">
        <span className="section-kicker">भक्ति से सेवा तक</span>
        <h2>सेवा के हमारे संकल्प</h2>
        <p>राम नाम के साथ सामाजिक और पर्यावरणीय सेवा से जुड़ें।</p>
      </div>
      <div className="seva-grid">
        {items.map(([Icon, t]) => (
          <div key={t}>
            <Icon size={30} />
            <strong>{t}</strong>
          </div>
        ))}
      </div>
      <a className="btn primary" href="#contact">
        सेवा में योगदान दें
      </a>
    </section>
  );
}

export function GalleryNews() {
  return (
    <section id="gallery" className="section-shell lower-grid">
      <article className="panel media-card">
        <div className="panel-title">
          <Music2 size={20} /> भजन एवं कीर्तन
        </div>
        <div className="media-placeholder">
          <div className="play">▶</div>
          <span>राम नाम संकीर्तन एवं आध्यात्मिक सामग्री</span>
        </div>
        <button className="btn primary full">सभी भजन देखें</button>
      </article>
      <article className="panel experience-card">
        <div className="panel-title">
          <MessageCircle size={20} /> भक्त अनुभव
        </div>
        <blockquote>
          “राम नाम लेखन ने मेरे दिन में शांति, अनुशासन और सकारात्मकता का एक नया
          भाव जोड़ा।”
        </blockquote>
        <p>— एक साधक, दिल्ली</p>
        <button className="btn secondary full">सभी अनुभव देखें</button>
      </article>
      <article className="panel gallery-card">
        <div className="panel-title">
          <Images size={20} /> गैलरी
        </div>
        <div className="mini-gallery">
          {["ॐ", "राम", "🚩", "🙏", "🪔", "🌺"].map((x, i) => (
            <div key={i}>{x}</div>
          ))}
        </div>
        <button className="btn secondary full">चित्र एवं वीडियो देखें</button>
      </article>
      <article className="panel news-card">
        <div className="panel-title">
          <Newspaper size={20} /> समाचार / अपडेट
        </div>
        <div className="news-item">
          <b>राम नाम लेखन अभियान से जुड़ें</b>
          <span>12,000+ साधक सामूहिक साधना से जुड़े</span>
        </div>
        <div className="news-item">
          <b>सामूहिक सुंदरकांड कार्यक्रम</b>
          <span>आगामी रविवार • ऑनलाइन</span>
        </div>
        <button className="btn primary full">सभी समाचार देखें</button>
      </article>
    </section>
  );
}

export function AboutPurpose() {
  return (
    <section className="section-shell about-purpose">
      <span className="section-kicker">हमारे अभियान का उद्देश्य</span>
      <h2>राम नाम लेखन • नाम-स्मरण • साधना • सेवा</h2>
      <p>
        राम नाम लेखन मन को एकाग्र करने और भक्ति से जोड़ने का सरल माध्यम है।
        हमारा उद्देश्य अधिक से अधिक लोगों को नियमित साधना, सामूहिक भक्ति और सेवा
        से जोड़ना है।
      </p>
      <div className="purpose-grid">
        <span>
          <BookOpen /> प्रतिदिन राम नाम लिखें
        </span>
        <span>
          <HeartHandshake /> सेवा कार्यों से जुड़ें
        </span>
        <span>
          <CalendarDays /> नियमित संकल्प निभाएं
        </span>
        <span>
          <MessageCircle /> अनुभव साझा करें
        </span>
      </div>
    </section>
  );
}
