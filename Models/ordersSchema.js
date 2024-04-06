const mongoose = require('mongoose');
const productSchema = require("./ProductSchema");

const orders = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    products:
        [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
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
        default: async () => {
            let totalPrice = 0;
            for (const item of this.products) {
                const product = await productSchema.findById(item.productId);
                totalPrice += product.price * item.quantity;
            }
            return totalPrice;
        }
    },
    totalItems: {
        type: Number,
        default: () => { let total = 0; products.foreach(item => { total += item.quantity }); return total; },
        immutable: true,
    }
})

module.exports = mongoose.model("Orders", orders)