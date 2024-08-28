import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Company = new Schema({
    name: { 
        type: String
    },
    address: { 
        type: String 
    },
    decorators: [{
        type: String
    }],
    contact: { 
        type: String

    },
    services: [
      {
        name: { type: String },
        price: { type: Number }
      }
    ],
    vacationPeriod: {
      from: { type: Date, default: null },
      to: { type: Date, default: null }
    }
  });

export default mongoose.model('Company', Company, 'companies');