const mongoose = require('mongoose');
const productSchema = require("./ProductSchema");
const { string } = require('joi');

const orders = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "UserDatas",
    },
    products:
        [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ProductData",
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
    pusrchaseDate: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    totalPrice: {
        type: Number,
    },
    totalItems: {
        type: Number,
        default: 0,
    },
    orderId: {
        type: String,
    }
})

module.exports = mongoose.model("Orders", orders)