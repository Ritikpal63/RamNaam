import { Link } from 'react-router-dom';
import { PenLine, Flower2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero section-shell">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-content">
        <div className="eyebrow"><Flower2 size={20}/> बाबा नीम करौली महाराज की प्रेरणा से</div>
        <h1>राम नाम लिखें,<br/>जीवन में भक्ति और सकारात्मकता को स्थान दें</h1>
        <p>प्रतिदिन कुछ समय प्रभु श्री राम को समर्पित करें। राम नाम लेखन, नाम-स्मरण, साधना और सेवा की इस सकारात्मक यात्रा से जुड़ें।</p>
        <div className="hero-actions">
          <a className="btn primary" href="#write"><PenLine size={20}/> राम नाम लिखना शुरू करें</a>
          <a className="btn secondary" href="#pledge">राम नाम का संकल्प लें</a>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="sun-disc">श्री<br/>राम</div>
        <div className="temple-shape"><span>ॐ</span></div>
      </div>
    </section>
  );
}
