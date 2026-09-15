import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const cards = [['11', 'दिन'], ['21', 'दिन'], ['40', 'दिन'], ['108', 'दिन'], ['1', 'लाख'], ['11', 'लाख']];
const payloads = [
  { title: '11 दिन का संकल्प', target: 1188, durationDays: 11 },
  { title: '21 दिन का संकल्प', target: 2268, durationDays: 21 },
  { title: '40 दिन का संकल्प', target: 4320, durationDays: 40 },
  { title: '108 दिन का संकल्प', target: 11664, durationDays: 108 },
  { title: '1 लाख राम नाम', target: 100000, durationDays: 365 },
  { title: '11 लाख राम नाम', target: 1100000, durationDays: 1080 }
];

export default function PledgeSection() {
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const createPledge = async (index) => {
    if (!user) return setMessage('संकल्प लेने के लिए पहले लॉगिन करें।');
    try {
      const { data } = await api.post('/pledges', payloads[index]);
      setMessage(`संकल्प सफल। आपका Sankalp ID: ${data.pledge.sankalpId}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'संकल्प सेव नहीं हो पाया।');
    }
  };

  return (
    <section id="pledge" className="section-shell pledge-section">
      <div className="pledge-intro">
        <span className="section-kicker">राम नाम संकल्प</span>
        <h2>एक संकल्प — नियमित साधना की ओर</h2>
        <p>अपनी सुविधा और श्रद्धा के अनुसार लक्ष्य चुनें। संख्या से अधिक महत्वपूर्ण नियमितता और भाव है।</p>
      </div>
      <div className="pledge-cards">
        {cards.map(([number, unit], index) => (
          <button className="pledge-card" onClick={() => createPledge(index)} key={number + unit}>
            <strong>{number}</strong>
            <span>{unit}</span>
            <small>राम नाम संकल्प</small>
            <em>संकल्प लें →</em>
          </button>
        ))}
      </div>
      {message && <p className="form-message centered">{message}</p>}
    </section>
  );
}
