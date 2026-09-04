const router = require('express').Router();
const pool = require('../config/db');
const { auth, adminOnly } = require('../middleware/auth');

router.use(auth, adminOnly);

router.get('/overview', async(_req,res,next)=>{
  try{
    const [[u]] = await pool.query('SELECT COUNT(*) totalUsers FROM users');
    const [[r]] = await pool.query(`SELECT COALESCE(SUM(count),0) totalRamNames,COALESCE(SUM(CASE WHEN entry_date=CURDATE() THEN count ELSE 0 END),0) todayRamNames FROM ram_name_entries WHERE status='approved'`);
    const [[p]] = await pool.query(`SELECT COUNT(*) activePledges FROM pledges WHERE status='active'`);
    const [[e]] = await pool.query(`SELECT COUNT(*) upcomingEvents FROM events WHERE status='published' AND event_date>=CURDATE()`);
    const [[x]] = await pool.query(`SELECT COUNT(*) pendingExperiences FROM devotee_experiences WHERE status='pending'`);
    res.json({...u,...r,...p,...e,...x});
  }catch(err){next(err)}
});

router.patch('/ramnaam/:id/status', async(req,res,next)=>{
  try{
    const status = ['approved','rejected'].includes(req.body.status) ? req.body.status : null;
    if(!status) return res.status(400).json({message:'Invalid status'});
    await pool.query('UPDATE ram_name_entries SET status=?, verified_by=?, verified_at=NOW() WHERE id=?',[status,req.user.id,req.params.id]);
    res.json({message:'Updated'});
  }catch(e){next(e)}
});

module.exports = router;
