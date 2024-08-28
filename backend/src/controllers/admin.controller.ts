import * as express from 'express';
import User from '../models/user';
import Company from '../models/company';
import path from 'path';
    

export class AdminController {

    getAllUsers = (req: express.Request, res: express.Response) => {
        User.find().then(users => {
            res.json(users);
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom ucitavanja korisnika!' });
        });
    }

    getAllCompanies = (req: express.Request, res: express.Response) => {
        Company.find().then(companies => {
            res.json(companies);
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom ucitavanja firmi!' });
        });
    }

    deactivateUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        User.updateOne({ 'username': username }, { $set: { 'status': 'denied' } }).then(result => {
            if (result.modifiedCount === 0) {
                return res.json({ message: 'Korisnik ne postoji ili je već deaktiviran!' });
            }
            res.json({ message: 'Korisnik deaktiviran' });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom deaktivacije korisnika!(updateOne)' });
        });
    }
    

    activateUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        User.updateOne({ 'username': username }, { $set: { 'status': 'approved' } }).then(result => {
            if (result.modifiedCount === 0) {
                return res.json({ message: 'Korisnik ne postoji ili je već aktiviran!' });
            }
            res.json({ message: 'Korisnik aktiviran' });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom aktivacije korisnika!(updateOne)' });
        });
    }

    userUpdate = (req: express.Request, res: express.Response) => {
        let updatedUser = req.body;
    
        User.findOne({ 'username': updatedUser.username }).then(existingUser => {
            if (!existingUser) {
                return res.json({ message: 'Korisnik ne postoji!' });
            }
    
            User.deleteOne({ 'username': updatedUser.username }).then(() => {
                let newUser = new User(updatedUser);
    
                newUser.save().then(() => {
                    res.json({ message: 'Azuriranje uspesno' });
                }).catch(err => {
                    console.log(err);
                    res.json({ message: 'Problem prilikom snimanja novog korisnika!' });
                });
    
            }).catch(err => {
                console.log(err);
                res.json({ message: 'Problem prilikom brisanja starog korisnika!' });
            });
    
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom pretrage korisnika!' });
        });
    }
    
    getPendingUsers = (req: express.Request, res: express.Response) => {
        User.find({ 'status': 'pending' }).then(users => {
            res.json(users);
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom ucitavanja korisnika!' });
        });
    }

    getProfilePicture = (req: express.Request, res: express.Response) => {
        let picture = req.body.picture;
        console.log(picture);
        const filePath =  `./uploads${picture}`;
        res.sendFile(filePath, { root: path.join(__dirname, '../..') });
    }

    addCompany = (req: express.Request, res: express.Response) => {
        let company = new Company(req.body);
        company.save().then(() => {
            res.json({ message: 'Firma je uspesno dodata!' });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom dodavanja firme!' });
        });
    }

}