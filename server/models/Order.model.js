import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required:true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.Mixed,
      required: true
    },
    items: [ 
      {
        type: Schema.Types.Mixed,
        required: true
      }
    ],
    comments: {
      type: String,
      required: false
    }},{ timestamps: true });

export default model("Order", orderSchema);