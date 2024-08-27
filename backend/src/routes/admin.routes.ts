import express from 'express';;
import multer, { FileFilterCallback } from 'multer';    
import { AdminController } from '../controllers/admin.controller';

const adminRouter = express.Router();

const storage = multer.memoryStorage();

adminRouter.route('/users').get(
    (req, res) => new AdminController().getAllUsers(req, res)
)

adminRouter.route('/companies').get(
    (req, res) => new AdminController().getAllCompanies(req, res)
)


adminRouter.route('/userUpdate').post(
    (req, res) => new AdminController().userUpdate(req, res)
)

adminRouter.route('/deactivateUser').post(
    (req, res) => new AdminController().deactivateUser(req, res)
)

adminRouter.route('/activateUser').post(
    (req, res) => new AdminController().activateUser(req, res)
)

adminRouter.route('/pendingUsers').get(
    (req, res) => new AdminController().getPendingUsers(req, res)
)

adminRouter.route('/profilePicture').post(
    (req, res) => new AdminController().getProfilePicture(req, res)
)

export default adminRouter;