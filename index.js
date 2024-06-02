const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
const app = express()
const PORT = process.env.PORT || 5000
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const stripeRoute = require('./routes/stripe')

mongoose.set('strictQuery', true);
mongoose
.connect(process.env.MONGO
).then(()=>{
    console.log("Database Connected!!");
}).catch((err)=>{
    console.log(err);
});

app.use(cors());
app.use(express.json());
app.use('/api/user/', userRoute)
app.use('/api/auth/', authRoute)
app.use('/api/product/', productRoute)
app.use('/api/cart/', cartRoute)
app.use('/api/order/', orderRoute)
app.use('/api/checkout/', stripeRoute)

app.get('/', (req,res) => {
    res.send(`Hello on port ${PORT}`)
})

app.listen(PORT, () => {
    console.log(`Backend running at ${PORT}`);
})