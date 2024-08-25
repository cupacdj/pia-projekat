import * as express from 'express';
import User from '../models/user';
import * as argon2 from "argon2";
import sharp from 'sharp';
import path from 'path';
export class UserController {

    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        User.findOne({ 'username': username }).then(user => {
            if (!user) {
                return res.json({ message: 'Loš username ili password' });
            }

            if (user.status === 'pending') {
                return res.json({ message: 'Vaša registracija još uvek nije odobrena.' });
            } else if (user.status === 'rejected') {
                return res.json({ message: 'Vaša registracija je odbijena.' });
            }

            argon2.verify(user.password!, password).then(isMatch => {
                if (isMatch) {
                    res.json({ message: 'Login uspešan', user });
                } else {
                    res.json({ message: 'Loš username ili password' });
                }
            }).catch(err => {
                console.log(err);
                res.json({ message: 'Problem sa verifikacijom lozinke' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom logovanja!' });
        });
    };


    registerUser = (req: express.Request, res: express.Response) => {
        console.log(req.body);
        const { username, password, name, lastname, gender, address, number, email, creditCard } = req.body;
        const file = req.file;

        User.findOne({ 'username': username }).then(existingUser => {
            if (existingUser)
                return res.json({ message: 'Korisničko ime je zauzeto.' });

            User.findOne({ 'email': email }).then(existingEmail => {
                if (existingEmail)
                    return res.json({ message: 'Nalog sa ovim email-om već postoji.' });
                let picturePath = '';
                if (req.body.gender == 'M')
                    picturePath = 'uploads/defaultM.png';
                else
                    picturePath = 'uploads/defaultF.png';
                if (file) {
                    sharp(file.buffer)
                        .metadata()
                        .then(metadata => {
                            if (metadata && metadata.width && metadata.height && (metadata.width < 100 || metadata.height < 100 || metadata.width > 300 || metadata.height > 300)) {
                                return res.status(400).json({ message: 'Slika mora biti između 100x100 i 300x300 piksela.' });
                            }

                            const filename = Date.now() + path.extname(file.originalname);
                            picturePath = `uploads/${filename}`;

                            sharp(file.buffer)
                                .toFile(picturePath)
                                .then(() => {
                                    this.saveUser(username, password, name, lastname, gender, address, number, email, creditCard, picturePath, res);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.json({ message: 'Problem prilikom čuvanja slike.' });
                                });
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({ message: 'Problem prilikom obrade slike.' });
                        });
                } else {
                    // Ako nema slike, koristimo podrazumevanu i nastavljamo sa čuvanjem korisnika
                    this.saveUser(username, password, name, lastname, gender, address, number, email, creditCard, picturePath, res);
                }
            }).catch(err => {
                console.log(err);
                res.json({ message: 'Problem prilikom registracije(email)!' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom registracije(username)!' });
        });
    };

    private saveUser(username: string, password: string, name: string, lastname: string, gender: string, address: string, number: string, email: string, creditCard: string, picture: string, res: express.Response) {
        argon2.hash(password).then(hashedPassword => {
            console.log(hashedPassword);
            const newUser = new User({
                username,
                password: hashedPassword,
                name,
                lastname,
                gender,
                address,
                number,
                email,
                creditCard,
                picture,
                type: 'vlasnik',
                status: 'pending'
            });

            newUser.save().then(() => {
                res.json({ message: 'Zahtev za registraciju je uspešno odrađen, čeka se odobrenje administratora!' });
            }).catch(err => {
                console.log(err);
                res.json({ message: 'Problem prilikom registracije!(save)' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom registracije(password)' });
        });
    }
};
