import * as express from 'express';
import Job from '../models/job';
import sharp from 'sharp';
import path from 'path';

const mongoose = require('mongoose');

export class CompanyController {

    createJob(req: express.Request, res: express.Response) {
        let job = new Job(req.body);
        console.log(job.layoutData)
        job.save().then(() => {
            res.json({ message: 'Posao je uspesno zakazan.' });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Nije uspelo dodavanje posla' });
        });

    }

    getJobs(req: express.Request, res: express.Response) {

        Job.find().then(jobs => {
            res.json(jobs);
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom ucitavanja poslova!' });
        });
    }

    updateJob(req: express.Request, res: express.Response) {
        let job = new Job(req.body);

        Job.replaceOne({ _id: job._id }, job).then(result => {
            if (result.modifiedCount === 0) {
                return res.json({ message: 'Doslo je do greske prilikom azuriranja posla' });
            }
            res.json({ message: 'Posao je uspesno azuriran' });
        })
    }

    cancelJob(req: express.Request, res: express.Response) {
        let job = new Job(req.body);
        Job.updateOne({ _id: job._id }, { $set: { 'status': 'odbijen', 'rejectionComment': 'Otkazan od strane vlasnika' } }).then(result => {
            if (result.modifiedCount === 0) {
                return res.json({ message: 'Problem kod otkazivanja posla' });
            }
            res.json({ message: 'Posao je uspesno otkazan' });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem kod otkazivanja posla' });
        });
    }

    getCompany(req: express.Request, res: express.Response) {
        let company = req.body;
        Job.findOne({ 'name': company }).then(company => {
            res.json({ message: 'Firma uspesno nadjena', company: company });
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom nalazenja firme!' });
        });
    }

    uploadJobPhoto(req: express.Request, res: express.Response) {
        const id = new mongoose.Types.ObjectId(req.body._id);
        const file = req.file;
        if (file) {
            let picturePath = '';
            sharp(file.buffer).metadata().then(metadata => {
                const filename = Date.now() + path.extname(file.originalname);
                picturePath = `/${filename}`;

                sharp(file.buffer).toFile('uploads' + picturePath).catch(err => {
                    console.log(err);
                    res.json({ message: 'Problem prilikom čuvanja slike.' });

                });
                const now = new Date();
                Job.updateOne({ '_id': id }, { $set: { 'photo': picturePath, 'photoDate': now } }).then(result => {

                    if (result.modifiedCount === 0) {
                        return res.json({ message: 'Problem prilikom dodavanja slike.1' });
                    }
                    res.json({ message: 'Slika je uspesno dodata.' });
                }).catch(err => {
                    console.log(err);
                    res.json({ message: 'Problem prilikom dodavanja slike.2' });
                });
            }).catch(err => {
                console.log(err);
                res.json({ message: 'Problem prilikom obrade slike.' });
            });
        }
    }

    getJobPhoto = (req: express.Request, res: express.Response) => {
        const id = new mongoose.Types.ObjectId(req.body._id);
        Job.findOne({ '_id': id }).then(job => {
            if (job) {
                if (job.photo) {
                    const filePath = `./uploads${job.photo}`;
                    res.sendFile(filePath, { root: path.join(__dirname, '../..') });
                } else {
                    res.json({ message: 'Slika nije pronadjena' });
                }
            }
        }).catch(err => {
            console.log(err);
            res.json({ message: 'Problem prilikom nalazenja slike' });
        })

    }

}