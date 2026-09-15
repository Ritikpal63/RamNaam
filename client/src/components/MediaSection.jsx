import { Images, MessageCircle, Music2, Newspaper } from 'lucide-react';

export default function MediaSection() {
  return (
    <section id="gallery" className="section-shell lower-grid">
      <article className="panel media-card">
        <div className="panel-title"><Music2 size={20} /> भजन एवं कीर्तन</div>
        <div className="media-placeholder">
          <div className="play">▶</div>
          <span>राम नाम संकीर्तन एवं आध्यात्मिक सामग्री</span>
        </div>
        <button className="btn primary full">सभी भजन देखें</button>
      </article>

      <article className="panel experience-card">
        <div className="panel-title"><MessageCircle size={20} /> भक्त अनुभव</div>
        <blockquote>“राम नाम लेखन ने मेरे दिन में शांति, अनुशासन और सकारात्मकता का एक नया भाव जोड़ा।”</blockquote>
        <p>— एक साधक, दिल्ली</p>
        <button className="btn secondary full">सभी अनुभव देखें</button>
      </article>

      <article className="panel gallery-card">
        <div className="panel-title"><Images size={20} /> गैलरी</div>
        <div className="mini-gallery">
          {['ॐ', 'राम', '🚩', '🙏', '🪔', '🌺'].map((item, index) => <div key={index}>{item}</div>)}
        </div>
        <button className="btn secondary full">चित्र एवं वीडियो देखें</button>
      </article>

      <article className="panel news-card">
        <div className="panel-title"><Newspaper size={20} /> समाचार / अपडेट</div>
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
