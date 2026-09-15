import { GraduationCap, HeartHandshake, Stethoscope, Trees, Wheat } from 'lucide-react';

export default function SevaSection() {
  const services = [
    [Wheat, 'अन्न सेवा'],
    [GraduationCap, 'शिक्षा सेवा'],
    [Stethoscope, 'चिकित्सा सहायता'],
    [Trees, 'वृक्षारोपण'],
    [HeartHandshake, 'अन्य सेवा']
  ];

  return (
    <section id="seva" className="section-shell panel seva">
      <div className="section-heading">
        <span className="section-kicker">भक्ति से सेवा तक</span>
        <h2>सेवा के हमारे संकल्प</h2>
        <p>राम नाम के साथ सामाजिक और पर्यावरणीय सेवा से जुड़ें।</p>
      </div>
      <div className="seva-grid">
        {services.map(([Icon, label]) => (
          <div key={label}><Icon size={30} /><strong>{label}</strong></div>
        ))}
      </div>
      <a className="btn primary" href="#contact">सेवा में योगदान दें</a>
    </section>
  );
}
