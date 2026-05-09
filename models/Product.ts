import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this product.'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description.'],
    },
    image: {
        type: String,
        required: [true, 'Please provide an image url.'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide a category ID.'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price.'],
    },
    discount: {
        type: Number,
        default: 0,
    },
    isavailable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
