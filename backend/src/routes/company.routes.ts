import express from 'express';
import { CompanyController } from '../controllers/company.controller';

const companyRouter = express.Router();

companyRouter.route('/create-job').post(
    (req, res) => new CompanyController().createJob(req, res)
);

companyRouter.route('/jobs').get(
    (req, res) => new CompanyController().getJobs(req, res)
);

companyRouter.route('/update-job').post(
    (req, res) => new CompanyController().updateJob(req, res)
);

companyRouter.route('/cancel-job').post(
    (req, res) => new CompanyController().cancelJob(req, res)
);


export default companyRouter;