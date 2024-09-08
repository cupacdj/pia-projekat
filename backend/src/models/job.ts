import mongoose from 'mongoose'
import { pathToFileURL } from 'url';

const Schema = mongoose.Schema;

let Job = new Schema({
    _id: {
        type: Object, default: new mongoose.Types.ObjectId()
    },
    owner: {
        type: String, default: ''
    },
    decorator: {   
        type: String, default: ''
    },
    company: {
        type: String, default: ''
    },
    appointmentDate: {
        type: Date, default: null
    },
    appointmentTime: {
        type: String, default: ''
    },
    productionDate: {
        type: Date, default: null
    },
    finishedDate: {
        type: Date, default: null
    },
    area: {
        type: Number, default: 0
    },
    gardenType: {
        type: String, default: ''
    },
    poolArea: {
        type: Number, default: 0
    },
    greenArea: {
        type: Number, default: 0
    },
    furnitureArea: {
        type: Number, default: 0
    },
    fountainArea: {
        type: Number, default: 0
    },
    tables: {
        type: Number, default: 0
    },
    chairs: {
        type: Number, default: 0
    },
    additionalRequests: {
        type: String, default: ''
    },
    selectedServices: [{
        type: String, default: ''
    }],
    layoutData:{
        objects: [
            {
              type: { type: String, default: '' },
              x: { type: Number, default: 0 },
              y: { type: Number, default: 0 },
              width: { type: Number, default: 0 },  
              height: { type: Number, default: 0 }, 
              radius: { type: Number, default: 0 }, 
              color: { type: String, default: ''  }
            }
          ], default: []
    } ,
    status: {
        type: String, default: ''
    },
    grade: {
        type: Number, default: 0
    },
    comment: {
        type: String, default: ''
    },
    rejectionComment: {
        type: String, default: ''
    },
    poolCount: {
        type: Number, default: 0
    },
    fountainCount: {
        type: Number, default: 0
    },
    maintenance: {
        type: String, default: ''
    },
    maintenanceDate: {
        type: Date, default: null
    },
    maintenanceCompletionDate: {
        type: Date, default: null
    },
    maintenanceCompletionTime: {
        type: String, default: ''
    },
    photo: {
        type: String, default: ''
    }
  });

export default mongoose.model('Job', Job, 'jobs');