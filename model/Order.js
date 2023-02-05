const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    userId: {type: String, required: true, },
    products: [
        {
            productId: {type:String},
            quantity: {type:String, default: 1},
        }
    ],
    amount: {type:Number, required:true },
    address: {type:Object, required:true },
    status:{type:String, default: "pending"},
}, {timestamps: true}
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;