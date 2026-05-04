import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discountPrice:{
        type: Number,
        default: 0,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        enum:['electronics' , 'clothing' , 'shoes' , 'books' , 'furniture', 'other' ,"men's clothing", "women's clothing", "jewelery"],
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    images: [
        {
            url:{ type: String, required: true },
            public_id: { type: String, required: true },
        }
    ],
    ratings: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
                min: 0,
                max: 5,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model("Product", productSchema);

export default Product;