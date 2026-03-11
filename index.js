//config dotenv file
require('dotenv').config(); 
const express=require('express');
const axios=require('axios');
const app=express();
//variable
const path=require('path');
const bodyParser=require('body-parser');
const FormData = require("form-data");

// Data support text UNICODE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Get accss file css,js and images
app.use(express.static(path.join(__dirname,'Public')));

//route for the home page to serve the index.html file
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'Public','SRC','index.html'));
});

//Check if BOT_TOKEN and CHAT_ID are valid
if(!process.env.BOT_TOKEN || !process.env.CHAT_ID){
    console.log("Invalid BOT TOKEN OR CHAT ID");
}else{
    console.log("Successfully Verified BOT TOKEN AND CHAT ID");
    console.log("BOT_TOKEN: ",process.env.BOT_TOKEN);
    console.log("CHAT_ID: ",process.env.CHAT_ID);
};

//Create function check telegram connection
async function checkTelegramConnection(){
    try{ 
        const response= await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&text= Telegram Bot is working!`);
        if(response.data.ok){
            console.log("Telegram connection is working");
            console.log('BOT_Name: ',response.data.result.chat.first_name);
        }
    }catch(error){
        console.error("Error checking Telegram connection: ",error);
    }
};
checkTelegramConnection();

const formatprice = (price) => {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}


app.post("/sent",async(req,res)=>{
    
    const {
        productName,
        price,
        qty,
        description,
        createdDate,
        categoryName,
        
    }=req.body;
    if (!price || isNaN(price) || Number(price) <= 0) {
        return res.send("Price cannot be negative!");
    }
const message = `
🌟💎 *New Product Alert!* 💎🌟

🛍 *Product:* ${productName}
💲 *Price:* ${formatprice(Number(price))}
📊 *Qty:* ${qty}
📝 *Description:*${description}
📅 *Created On:* ${createdDate}
📂 *Category:* ${categoryName}

━━━━━━━━━━━━━━━
✨ *Grab it now before it's gone!* ✨

`;
    try{
       axios.post(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`
            ,
                {
                    chat_id:process.env.CHAT_ID,
                    text:message,
                    parse_mode:"Markdown"
                }
            );
            return res.send("Thank You for sent your message to Telegram Bot!");
    }catch(error) {
        res.send("Message sent to Telegram Error!"); }
});

module.exports=app;