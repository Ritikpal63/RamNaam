const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

router.post('/', auth, async (req,res,next)=>{
  try{
    const target = Number(req.body.target);
    const durationDays = Number(req.body.durationDays || 0);
    const title = String(req.body.title || 'राम नाम संकल्प').slice(0,120);
    if(!Number.isInteger(target) || target<1) return res.status(400).json({message:'सही संकल्प लक्ष्य चुनें।'});
    const sankalpId = `RN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random()*900000)}`;
    const id = uuidv4();
    await pool.query(`INSERT INTO pledges (id,user_id,sankalp_id,title,target_count,start_date,end_date,daily_goal,status)
      VALUES (?,?,?,?,?,CURDATE(),IF(? > 0,DATE_ADD(CURDATE(),INTERVAL ? DAY),NULL),CEIL(?/GREATEST(?,1)),"active")`,[id,req.user.id,sankalpId,title,target,durationDays,durationDays,target,durationDays]);
    res.status(201).json({pledge:{id,sankalpId,title,target}});
  }catch(e){next(e)}
});

router.get('/me', auth, async(req,res,next)=>{
  try{
    const [rows] = await pool.query(`SELECT p.*,
      LEAST(p.target_count,COALESCE((SELECT SUM(r.count) FROM ram_name_entries r WHERE r.user_id=p.user_id AND r.status='approved' AND r.entry_date>=p.start_date AND (p.end_date IS NULL OR r.entry_date<=p.end_date)),0)) progress_count
      FROM pledges p WHERE p.user_id=? ORDER BY p.created_at DESC`,[req.user.id]);
    res.json({pledges:rows});
  }catch(e){next(e)}
});

module.exports = router;
