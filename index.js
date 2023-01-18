const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3001;
require('./src/config/db')
app.use(express.json())

app.use('/api/v1',require('./src/routes/index'))
app.get('/',(req,res)=>{
    res.status(200).json({
        success : true,
        message:"DoorBell Project Initialzation Successfully",
        data:{}
    })
})

app.listen(port,()=>{
    console.log("DoorBell Is Running at Port No ->", port)
})
