import express from 'express';
import { CompanyController } from '../controllers/company.controller';
import multer, { FileFilterCallback } from 'multer';  

const companyRouter = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req: express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

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

companyRouter.route('/get-company').post(
    (req, res) => new CompanyController().getCompany(req, res)
);

companyRouter.route('/upload-photo').post(
    upload.single('photo'), 
    (req, res) => new CompanyController().uploadJobPhoto(req, res)
);

companyRouter.route('/get-photo').post(
    (req, res) => new CompanyController().getJobPhoto(req, res)
);


export default companyRouter;