import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let User = new Schema({
    username: {
        type: String, default: ''
    },
    password: {
        type: String, default: ''
    },
    name: {
        type: String, default: ''
    },
    lastname: {
        type: String, default: ''
    },
    gender: {
        type: String, default: ''
    },
    address: {
        type: String, default: ''
    },
    number: {
        type: String, default: ''
    },
    email: {
        type: String, default: ''
    },
    creditCard: {
        type: String, default: ''
    },
    type: {
        type: String, default: ''
    },
    picture: {
        type: String, default: ''
    },
    status: {
        type: String, default: ''
    },
    company: {
        type: String, default: ''
    }, 
    scheduler: {
        type: [Date], default: []
    }
})

export default mongoose.model('User', User, 'users');