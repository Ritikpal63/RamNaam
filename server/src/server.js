require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = Number(process.env.PORT || 8000);

(async()=>{
  try{
    await pool.query('SELECT 1');
    console.log('✅ MySQL connected');
    app.listen(PORT,()=>console.log(`🚩 Shri Ram Naam API running on http://localhost:${PORT}`));
  }catch(e){
    console.error('❌ Database connection failed:',e.message);
    process.exit(1);
  }
})();
