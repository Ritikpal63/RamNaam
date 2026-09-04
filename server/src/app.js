const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true, credentials: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/api', rateLimit({ windowMs: 15*60*1000, limit: 400, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (_req,res)=>res.json({success:true,message:'Shri Ram Naam API is running'}));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/public', require('./routes/public'));
app.use('/api/ramnaam', require('./routes/ramnaam'));
app.use('/api/pledges', require('./routes/pledges'));
app.use('/api/admin', require('./routes/admin'));

app.use((req,res)=>res.status(404).json({message:'API route not found'}));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({message:'Server error. कृपया बाद में फिर प्रयास करें।'});});

module.exports = app;
