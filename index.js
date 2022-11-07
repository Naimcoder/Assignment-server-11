const express= require('express')
const cors= require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app= express()
const jwt= require('jsonwebtoken');
const { query } = require('express');
const port= process.env.PORT || 5000;
require('dotenv').config()
// 
app.use(cors())
app.use(express.json())






async function run(){
    try{
     const productsCollection= client.db('').collection('')

    }
    finally{

    }
}run().catch(error=>console.log(error))


app.get('/',(req,res)=>{
    res.send('My Server running')
})


app.listen(port,()=>{
    console.log(`my server Running${port}`)
})