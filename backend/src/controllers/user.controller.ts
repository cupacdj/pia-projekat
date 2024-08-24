import * as express from 'express';
import User from '../models/user';
import * as argon2 from "argon2";

export class UserController {

    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        User.findOne({ 'username': username, 'password': password }).then(user => {
            if (!user) {
                return res/*.status(404)*/.json({ message: 'Los username ili password' });
            }
            res.json({message: 'Login uspesan', user})

            // argon2.verify(user.password!, password).then(isMatch => {
            //     if (isMatch) {
            //         res.json({ message: 'Login uspesan', user });
            //     } else {
            //         res/*.status(404)*/.json({ message: 'Los username ili password' });
            //     }
            // }).catch(err => {
            //     console.log(err);
            //     res/*.status(500)*/.json({ message: 'Problem sa verifikacijom lozinke' });
            // });
        }).catch(err => {
            console.log(err);
            res/*.status(500)*/.json({ message: 'Problem nalazenja korisnika' });
        });
    };
    
}