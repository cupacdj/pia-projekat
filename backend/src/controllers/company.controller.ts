import * as express from 'express';
import Job from '../models/job';

export class CompanyController {

    createJob(req: express.Request, res: express.Response) {
        let job = new Job(req.body);
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
            if (result.modifiedCount === 0){
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

}