import express from 'express';
import { CompanyController } from '../controllers/company.controller';

const companyRouter = express.Router();

companyRouter.route('/create-job').post(
    (req, res) => new CompanyController().createJob(req, res)
);


export default companyRouter;