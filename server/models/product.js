const Mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const { Schema } = Mongoose;

const options = {
  separator: '-',
  lang: 'en',
  truncate: 120
};

Mongoose.plugin(slug, options);

// Product Schema
const ProductSchema = new Schema({
  sku: {
    type: String
  },
  name: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    slug: 'name',
    unique: true
  },
  imageUrl: {
    type: String
  },
  imageKey: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number
  },
  price: {
    type: Number
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  discountedPrice: {
    type: Number,
    default: function() {
      return this.price;
    }
  },
  taxable: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    default: null
  },
   
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to calculate discounted price
ProductSchema.pre('save', function(next) {
  if (this.price && this.discount >= 0 && this.discount <= 100) {
    this.discountedPrice = this.price - (this.price * this.discount / 100);
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

module.exports = Mongoose.model('Product', ProductSchema);
