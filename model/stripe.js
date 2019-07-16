var mongoose = require("mongoose");

var stripeSchema = mongoose.Schema({
  id: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  label: {
    type: String,
    trim: true,
    uppercase: true,
    unique: true,
    required: true
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  type: {
    type: String,
    enum: ["service", "good"],
    required: true
  },
  plans: [
    {
      id: {
        type: String,
        unique: true,
        required: true
      },
      label: {
        type: String,
        trim: true,
        uppercase: true,
        unique: true,
        required: true
      },
      name: {
        type: String,
        trim: true,
        required: true
      },
      currency: {
        type: String,
        enum: ["cad"],
        required: true
      },
      interval: {
        type: String,
        enum: ["day", "week", "month", "year"],
        required: true
      },
      amount: {
        type: Number,
        min: 0,
        set: v => Math.ceil(v),
        required: true
      }
    }
  ]
});

var StripeConfig = (module.exports = mongoose.model("Stripe", stripeSchema));
