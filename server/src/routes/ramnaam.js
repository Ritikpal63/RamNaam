const router = require('express').Router();
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const DIGITAL_RAM_NAAM = 'श्री राम';
const MAX_DIGITAL_PAGE = 108;

const normalizeRamNaam = (value) => String(value || '').trim().replace(/\s+/g, ' ');

const getUserTotals = async (userId) => {
  const [[sum]] = await pool.query(`SELECT COALESCE(SUM(count),0) totalCount,
    COALESCE(SUM(CASE WHEN entry_date=CURDATE() THEN count ELSE 0 END),0) todayCount
    FROM ram_name_entries WHERE user_id=? AND status="approved"`, [userId]);
  return {
    totalCount: Number(sum.totalCount || 0),
    todayCount: Number(sum.todayCount || 0),
  };
};

router.post('/deposit', auth, async (req, res, next) => {
  try {
    const entries = Array.isArray(req.body.entries) ? req.body.entries : [];
    const pageId = String(req.body.pageId || '').trim();

    if (!pageId || pageId.length > 100) {
      return res.status(400).json({ message: 'लेखन पृष्ठ की पहचान सही नहीं है। कृपया पृष्ठ रीसेट करके दोबारा प्रयास करें।' });
    }

    if (entries.length < 1 || entries.length > MAX_DIGITAL_PAGE) {
      return res.status(400).json({ message: 'एक पृष्ठ में 1 से 108 तक पूरे राम नाम ही जमा किए जा सकते हैं।' });
    }

    const validEntries = entries.filter((entry) => normalizeRamNaam(entry) === DIGITAL_RAM_NAAM);
    const count = validEntries.length;

    if (count !== entries.length || count < 1) {
      return res.status(400).json({ message: 'केवल पूरा “श्री राम” ही गिना और जमा किया जाएगा।' });
    }

    const note = `digital-page:${pageId}`;
    const [[existing]] = await pool.query(
      'SELECT id FROM ram_name_entries WHERE user_id=? AND note=? LIMIT 1',
      [req.user.id, note]
    );

    if (existing) {
      const totals = await getUserTotals(req.user.id);
      return res.status(409).json({
        message: 'यह लेखन पृष्ठ पहले ही जमा हो चुका है। दोबारा गिनती नहीं जोड़ी गई।',
        ...totals,
      });
    }

    const [result] = await pool.query(
      'INSERT INTO ram_name_entries (user_id,count,mode,note,status,entry_date) VALUES (?,?,?,?,?,CURDATE())',
      [req.user.id, count, 'digital', note, 'approved']
    );

    const totals = await getUserTotals(req.user.id);
    res.status(201).json({
      id: result.insertId,
      count,
      status: 'approved',
      ...totals,
    });
  } catch (e) {
    next(e);
  }
});

router.post('/add', auth, async (req, res, next) => {
  try {
    const count = Number(req.body.count);
    const mode = ['manual', 'offline'].includes(req.body.mode) ? req.body.mode : null;

    if (!mode) {
      return res.status(400).json({
        message: 'ऑनलाइन राम नाम के लिए संख्या सीधे नहीं जोड़ी जा सकती। अक्षर/मात्रा से लिखकर पृष्ठ जमा करें।',
      });
    }

    if (!Number.isInteger(count) || count < 1 || count > 1000000) {
      return res.status(400).json({ message: 'सही राम नाम संख्या दर्ज करें।' });
    }

    const status = mode === 'offline' ? 'pending' : 'approved';
    const [result] = await pool.query(
      'INSERT INTO ram_name_entries (user_id,count,mode,note,status,entry_date) VALUES (?,?,?,?,?,CURDATE())',
      [req.user.id, count, mode, req.body.note || '', status]
    );
    res.status(201).json({ id: result.insertId, count, status });
  } catch (e) {
    next(e);
  }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const totals = await getUserTotals(req.user.id);
    const [days] = await pool.query(
      'SELECT DISTINCT entry_date FROM ram_name_entries WHERE user_id=? AND status="approved" ORDER BY entry_date DESC LIMIT 400',
      [req.user.id]
    );
    const dates = new Set(days.map((r) => new Date(r.entry_date).toISOString().slice(0, 10)));
    const iso = (d) => d.toISOString().slice(0, 10);
    let currentStreak = 0;
    let cursor = new Date();
    if (!dates.has(iso(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (dates.has(iso(cursor))) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    let longestStreak = 0;
    let run = 0;
    let prev = null;
    [...dates].sort().forEach((s) => {
      const d = new Date(`${s}T00:00:00`);
      if (prev && (d - prev) === 86400000) run++;
      else run = 1;
      longestStreak = Math.max(longestStreak, run);
      prev = d;
    });

    res.json({ ...totals, currentStreak, longestStreak });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
