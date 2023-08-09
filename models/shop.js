const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true, trim: true },
    photo: { type: String , default: 'nopic.jpeg'},
    location: {
        lat: Number,
        lgn: Number
    },

    // createdAt: { type: Date, default: Date.now }, เพิ่มอัตโนมัติ เมื่อใส่ timestamp
    // updatedAt: { type: Date, default: Date.now }, เพิ่มอัตโนมัติ เมื่อใส่ timestamp
}, {
    //Schema Option
    toJSON: { virtuals: true },
    timestamps: true,
    collection: 'shops'
});

schema.virtual('menus', {
    ref: 'Menu', // Link model menu
    localField: '_id', // _id Field model Shop
    foreignField: 'shop' //shop is Field model menu FK
})

const shop = mongoose.model('Shop', schema);

module.exports = shop;