import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Job = new Schema({
    owner: {
        type: String
    },
    decorator: {   
        type: String
    },
    company: {
        type: String
    },
    appointmentDate: {
        type: Date
    },
    appointmentTime: {
        type: String
    },
    productionDate: {
        type: Date
    },
    finishedDate: {
        type: Date
    },
    area: {
        type: Number
    },
    gardenType: {
        type: String
    },
    poolArea: {
        type: Number
    },
    greenArea: {
        type: Number
    },
    furnitureArea: {
        type: Number
    },
    fountainArea: {
        type: Number
    },
    tables: {
        type: Number
    },
    chairs: {
        type: Number
    },
    additionalRequests: {
        type: String
    },
    selectedServices: [{
        type: String
    }],
    layoutData:{
        objects: [
            {
              type: { type: String },
              x: { type: Number },
              y: { type: Number },
              width: { type: Number },  
              height: { type: Number }, 
              radius: { type: Number }, 
              color: { type: String  }
            }
          ]
    },
    status: {
        type: String
    },
    grade: {
        type: Number
    },
    comment: {
        type: String
    },
    rejectionComment: {
        type: String
    },
    poolCount: {
        type: Number
    },
    fountainCount: {
        type: Number
    },
    maintenance: {
        type: String
    },
    maintenanceDate: {
        type: Date
    },
    maintenanceCompletitionDate: {
        type: Date
    },
    maintenanceCompletitionTime: {
        type: String
    }
  });

export default mongoose.model('Job', Job, 'jobs');