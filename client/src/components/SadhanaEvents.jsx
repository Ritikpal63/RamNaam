export default function SadhanaEvents() {
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
          ['25', 'सामूहिक राम नाम लेखन', 'सुबह 06:00 - 08:00'],
          ['25', 'सुंदरकांड पाठ', 'दोपहर 03:00 - 05:00'],
          ['26', 'हनुमान चालीसा पाठ', 'शाम 07:00 - 08:00']
        ].map((event) => (
          <div className="event-row" key={event[1]}>
            <b>{event[0]}<small>सित.</small></b>
            <span><strong>{event[1]}</strong><small>{event[2]} • ऑनलाइन</small></span>
          </div>
        ))}
      </article>
    </section>
  );
}
