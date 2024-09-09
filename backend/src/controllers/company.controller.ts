import * as express from 'express';
import Job from '../models/job';
import sharp from 'sharp';
import path from 'path';
import Company from '../models/company';

const mongoose = require('mongoose');

export class CompanyController {

    createJob(req: express.Request, res: express.Response) {
        let job = new Job(req.body);
        const newj = new Job({
            _id: new mongoose.Types.ObjectId(),
            owner: job.owner,
            decorator: job.decorator,
            company: job.company,
            appointmentDate: job.appointmentDate,
            appointmentTime: job.appointmentTime,
            productionDate: job.productionDate,
            finishedDate: job.finishedDate,
            area: job.area,
            gardenType: job.gardenType,
            poolArea: job.poolArea,
            greenArea: job.greenArea,
            furnitureArea: job.furnitureArea,
            fountainArea: job.fountainArea,
            tables: job.tables,
            chairs: job.chairs,
            additionalRequests: job.additionalRequests,
            selectedServices: job.selectedServices,
            layoutData: job.layoutData,
            status: job.status,
            rejectionComment: job.rejectionComment,
            photo: job.photo,
            maintenance: job.maintenance,
            maintenanceDate: job.maintenanceCompletionDate,
            maintenanceTime: job.maintenanceCompletionTime,
        })
        newj.save().then(() => {
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
        const id = new mongoose.Types.ObjectId(req.body._id);
        job._id = id;
        Job.replaceOne({ '_id': id }, job).then(result => {
            if (result.modifiedCount === 0) {
                return res.json({ message: 'Doslo je do greske prilikom azuriranja posla' });
            }
            res.json({ message: 'Posao je uspesno azuriran' });
        })
    }

    cancelJob(req: express.Request, res: express.Response) {
        let job = new Job(req.body);
        const id = new mongoose.Types.ObjectId(req.body._id);
        job._id = id;
        Job.updateOne({ '_id': id }, { $set: { 'status': 'odbijen', 'rejectionComment': 'Otkazan od strane vlasnika' } }).then(result => {
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
        let name = req.body.company;
        Company.findOne({ 'name': name }).then(company => {
            if (!company) {
                res.json({ message: 'Firma nije pronadjena' });
                return;
            }
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
                Job.updateOne({ '_id': id }, { $set: { 'photo': picturePath} }).then(result => {

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