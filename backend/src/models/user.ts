import mongoose from 'mongoose'
import company from './company';

const Schema = mongoose.Schema;

let User = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    gender: {
        type: String
    },
    address: {
        type: String
    },
    number: {
        type: String
    },
    email: {
        type: String
    },
    creditCard: {
        type: String
    },
    type: {
        type: String
    },
    picture: {
        type: String
    },
    status: {
        type: String
    },
    company: {
        type: String
    }
})

export default mongoose.model('User', User, 'users');