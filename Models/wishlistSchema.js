const mongoose = require("mongoose");

const wishList = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDatas",
        required: true,
    },
    wishList: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductData",
            required: true,
        }
    }],
});

module.exports = mongoose.model("wishItems", wishList);
