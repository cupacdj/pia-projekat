import * as express from 'express';
import User from '../models/user';
import * as argon2 from "argon2";
import sharp from 'sharp';
import path from 'path';

const axios = require('axios');
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
            } else if (user.status === 'denied') {
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
        const { username, password, name, lastname, gender, address, number, email, creditCard, type, company, captchaToken } = req.body;
        const file = req.file;

        const secretKey = '6LdoeDcqAAAAAJDfORztAVN_SkAennCKu1G4keoS';
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
        axios.post(verificationURL)
            .then((response: any) => {
                if (response.data.success) {
                    console.log('Captcha verifikacija uspela');
                    User.findOne({ 'username': username }).then(existingUser => {
                        if (existingUser)
                            return res.json({ message: 'Korisničko ime je zauzeto.' });

                        User.findOne({ 'email': email }).then(existingEmail => {
                            if (existingEmail)
                                return res.json({ message: 'Nalog sa ovim email-om već postoji.' });
                            let picturePath = '';
                            if (req.body.gender == 'M')
                                picturePath = '/defaultM.png';
                            else
                                picturePath = '/defaultF.png';
                            if (file) {
                                sharp(file.buffer)
                                    .metadata()
                                    .then(metadata => {
                                        if (metadata && metadata.width && metadata.height && (metadata.width < 100 || metadata.height < 100 || metadata.width > 300 || metadata.height > 300)) {
                                            return res.json({ message: 'Slika mora biti između 100x100 i 300x300 piksela.' });
                                        }

                                        const filename = Date.now() + path.extname(file.originalname);
                                        picturePath = `/${filename}`;

                                        sharp(file.buffer)
                                            .toFile('uploads' + picturePath)
                                            .then(() => {
                                                this.saveUser(username, password, name, lastname, gender, address, number, email, type, creditCard, company, picturePath, res);
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
                                this.saveUser(username, password, name, lastname, gender, address, number, email, type, creditCard, company, picturePath, res);
                            }
                        }).catch(err => {
                            console.log(err);
                            res.json({ message: 'Problem prilikom registracije(email)!' });
                        });
                    }).catch(err => {
                        console.log(err);
                        res.json({ message: 'Problem prilikom registracije(username)!' });
                    });
                }
                else {
                    console.log('Captcha verifikacija nije uspela');
                    return res.json({ message: 'Captcha verifikacija nije uspela.' });
                }
            }).catch((error: any) => {
                console.log(error);
                res.json({ message: 'Problem prilikom verifikacije captcha!' });
            })

    };

    private saveUser(username: string, password: string, name: string, lastname: string, gender: string, address: string, number: string, email: string, type: string, creditCard: string, company: string, picture: string, res: express.Response) {
        argon2.hash(password).then(hashedPassword => {
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
                type,
                company
            });
            if (type == 'vlasnik') {
                newUser.status = 'pending';
            } else if (type == 'dekorater') {
                newUser.status = 'approved';
                newUser.scheduler = [];
            }

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

    changePassword = (req: express.Request, res: express.Response) => {
        const { username, oldPassword, newPassword } = req.body;

        User.findOne({ 'username': username }).then(user => {
            if (!user) {
                return res.json({ message: 'Korisnik nije pronađen.' });
            }

            argon2.verify(user.password!, oldPassword).then(isMatch => {
                if (!isMatch) {
                    return res.json({ message: 'Stara lozinka nije ispravna.' });
                }

                argon2.hash(newPassword).then(hashedPassword => {
                    user.password = hashedPassword;
                    user.save().then(() => {
                        res.json({ message: 'Lozinka uspešno promenjena' });
                    }).catch(err => {
                        console.log(err);
                        res.json({ message: 'Greška prilikom čuvanja nove lozinke.' });
                    });
                }).catch(err => {
                    console.log(err);
                    res.json({ message: 'Greška prilikom obrade nove lozinke.' });
                });
            }).catch(err => {
                console.log(err);
                res.json({ message: 'Greška prilikom verifikacije stare lozinke.' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Greška prilikom pronalaženja korisnika.' });
        });
    };


    getUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        User.findOne({ 'username': username }).then(user => {
            res.json({ message: 'Korisnik pronadjen', user });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom pretrage korisnika!' });
        });
    }

    getProfilePicture = (req: express.Request, res: express.Response) => {
        let picture = req.body.picture;
        const filePath = `./uploads${picture}`;
        res.sendFile(filePath, { root: path.join(__dirname, '../..') });
    }

    userUpdate = (req: express.Request, res: express.Response) => {
        const updatedUser = req.body;
        updatedUser.status = 'approved';
        if (updatedUser.type == 'dekorater') {
            if (updatedUser.scheduling == '' || updatedUser.scheduling == null || updatedUser.scheduling == 'undefined') {
                updatedUser.scheduler = [];
            } else {
                updatedUser.scheduler = updatedUser.scheduler;
            }
        }
        User.replaceOne({ 'username': updatedUser.username }, updatedUser).then(result => {
            if (result.modifiedCount === 0) {
                return res.json({ message: 'Doslo je do greske prilikom azuriranja korisnika' });
            }
            res.json({ message: 'Korisnik je uspesno azuriran' });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom azuriranja korisnika!' });
        });
    }


    updateUserPicture = (req: express.Request, res: express.Response) => {
        const updatedUser = req.body;
        const file = req.file;

        if (file) {
            let picturePath = '';
            sharp(file.buffer).metadata().then(metadata => {
                if (metadata && metadata.width && metadata.height && (metadata.width < 100 || metadata.height < 100 || metadata.width > 300 || metadata.height > 300)) {
                    return res.json({ message: 'Slika mora biti između 100x100 i 300x300 piksela.' });
                }
                const filename = Date.now() + path.extname(file.originalname);
                picturePath = `/${filename}`;


                sharp(file.buffer).toFile('uploads' + picturePath).catch(err => {
                    console.log(err);
                    res.json({ message: 'Problem prilikom čuvanja slike.' });

                });
                updatedUser.picture = picturePath;
                updatedUser.status = 'approved';
                if (updatedUser.type == 'dekorater') {
                    if (updatedUser.scheduling == '' || updatedUser.scheduling == null || updatedUser.scheduling == 'undefined') {
                        updatedUser.scheduler = [];
                    } else {
                        updatedUser.scheduler = updatedUser.scheduler;
                    }
                }
                User.replaceOne({ 'username': updatedUser.username }, updatedUser).then(result => {
                    if (result.modifiedCount === 0) {
                        return res.json({ message: 'Doslo je do greske prilikom azuriranja korisnika' });
                    }
                    res.json({ message: 'Korisnik je uspesno azuriran' });
                }).catch(err => {
                    console.log(err);
                    res.json({ message: 'Problem prilikom azuriranja korisnika!' });
                });
            }).catch(err => {
                console.log(err);
                res.json({ message: 'Problem prilikom obrade slike.' });
            });
        }
    }
}


