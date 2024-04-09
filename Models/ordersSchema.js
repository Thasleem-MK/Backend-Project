const mongoose = require('mongoose');
const productSchema = require("./ProductSchema");

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
    }
})

module.exports = mongoose.model("Orders", orders)