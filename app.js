const express=require('express');
const app=express();
const env=require('dotenv');

// enable project to read .env
env.config();

app.use(require('./routes/routes'));

const db = require('./engine/db');

app.listen(process.env.PORT,()=>{
    console.log(`Server is up and running on port ${process.env.PORT}`);
})
