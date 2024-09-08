import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Company = new Schema({
    name: { 
        type: String, default: ''
    },
    address: { 
        type: String, default: ''
    },
    decorators: [{
        type: String, default: ''
    }],
    contact: { 
        type: String, default: ''

    },
    services: [
      {
        name: { type: String, default: '' },
        price: { type: Number, default: 0 }
      }
    ],
    vacationPeriod: {
      from: { type: Date, default: null },
      to: { type: Date, default: null }
    },
    location: {
      type: String, default: ''
    }
  });

export default mongoose.model('Company', Company, 'companies');