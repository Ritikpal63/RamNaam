const router = require('express').Router();
const pool = require('../config/db');

router.get('/stats', async (_req, res, next) => {
  try {
    const [[users]] = await pool.query('SELECT COUNT(*) totalUsers FROM users WHERE status="active"');
    const [[counts]] = await pool.query(`SELECT
      COALESCE(SUM(count),0) totalRamNames,
      COALESCE(SUM(CASE WHEN DATE(entry_date)=CURDATE() THEN count ELSE 0 END),0) todayRamNames,
      COALESCE(SUM(CASE WHEN YEAR(entry_date)=YEAR(CURDATE()) AND MONTH(entry_date)=MONTH(CURDATE()) THEN count ELSE 0 END),0) monthRamNames
      FROM ram_name_entries WHERE status="approved"`);
    res.json({ totalUsers: users.totalUsers, ...counts });
  } catch (e) { next(e); }
});

router.get('/events', async (req, res, next) => {
  try {
    const limit = Math.min(20, Math.max(1, Number(req.query.limit || 6)));
    const [rows] = await pool.query('SELECT id,title,event_date,event_time,location,mode,description,banner,status FROM events WHERE status="published" AND event_date>=CURDATE() ORDER BY event_date,event_time LIMIT ?', [limit]);
    res.json({ events: rows });
  } catch(e){ next(e); }
});

router.get('/gallery', async (req, res, next) => {
  try {
    const limit = Math.min(24, Math.max(1, Number(req.query.limit || 8)));
    const [rows] = await pool.query('SELECT id,title,category,image_url,description FROM gallery WHERE status="published" ORDER BY created_at DESC LIMIT ?', [limit]);
    res.json({ items: rows });
  } catch(e){ next(e); }
});

router.get('/news', async (req, res, next) => {
  try {
    const limit = Math.min(20, Math.max(1, Number(req.query.limit || 6)));
    const [rows] = await pool.query('SELECT id,title,slug,excerpt,featured_image,published_at FROM news_posts WHERE status="published" ORDER BY published_at DESC LIMIT ?', [limit]);
    res.json({ posts: rows });
  } catch(e){ next(e); }
});

router.post('/contact', async (req, res, next) => {
  try {
    const { name, email='', mobile='', subject='', message } = req.body;
    if(!name || !message) return res.status(400).json({message:'नाम और संदेश आवश्यक हैं।'});
    await pool.query('INSERT INTO contact_messages (name,email,mobile,subject,message) VALUES (?,?,?,?,?)',[name,email,mobile,subject,message]);
    res.status(201).json({message:'आपका संदेश प्राप्त हो गया।'});
  } catch(e){ next(e); }
});

module.exports = router;
