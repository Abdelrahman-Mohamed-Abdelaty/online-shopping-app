import passport from 'passport';
// @ts-ignore
import GoogleStrategy  from 'passport-google-oidc' ;
import {NextFunction, Router} from "express";
import {deserializeHandler, googleStrategyOptions, serializeHandler, verifyUser} from "../utility";
import {
    createUser, deleteMe,
    deleteUser,
    getAllUsers, getMe,
    getUserById,
    login,
    logout,
    protect,
    restrictTo,
    signup
} from "../controllers";
const router=Router();

// Configure passport
// passport.serializeUser(serializeHandler);
// passport.deserializeUser(deserializeHandler);

passport.use(new GoogleStrategy(googleStrategyOptions,
    verifyUser
));


// Routes
router.post('/login',login)
router.post('/signup',signup)
router.use(protect);
router.post('/logout',logout)
router.delete("/deleteMe",deleteMe)
router.get("/me",getMe,getUserById);

router.get("/",restrictTo('admin'),getAllUsers)
router.get("/:id",restrictTo('admin'),getUserById)
router.post('/',restrictTo('admin'),createUser)
router.delete('/:id',restrictTo('admin'),deleteUser)

router.use(passport.authenticate('session'));
router.get('/login/google', passport.authenticate('google'));
router.get('/oauth2/redirect/google',
    passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
    function(req, res) {
        res.redirect('/');
    });

// router.post('/logout-google',logout);

export {router as userRoute}