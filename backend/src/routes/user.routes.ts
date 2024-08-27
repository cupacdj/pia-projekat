import express from 'express';
import { UserController } from '../controllers/user.controller';
import multer, { FileFilterCallback } from 'multer';    

const userRouter = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req: express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)
);

userRouter.route('/register').post(
    upload.single('picture'),  
    (req, res) => new UserController().registerUser(req, res)
);

userRouter.route('/change-password').post(
     (req, res) => new UserController().changePassword(req, res)
);

userRouter.route('/get-user').post(
    (req, res) => new UserController().getUser(req, res)
);

userRouter.route('/profilePicture').post(
    (req, res) => new UserController().getProfilePicture(req, res)
)

userRouter.route('/update-user').post( 
    (req, res) => new UserController().userUpdate(req, res)
)

userRouter.route('/update-user-picture').post(
    upload.single('picture'),  
    (req, res) => new UserController().updateUserPicture(req, res)
)

export default userRouter;
