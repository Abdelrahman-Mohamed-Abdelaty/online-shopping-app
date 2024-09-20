import passport from 'passport';
// @ts-ignore
import GoogleStrategy  from 'passport-google-oidc' ;
import {NextFunction, Router} from "express";
import {deserializeHandler, googleStrategyOptions, serializeHandler, verifyUser} from "../utility";
import {
    createUser, deleteMe, deleteMyNotification,
    deleteUser, getAllComplaints, getAllOrders,
    getAllUsers, getMe, getMyNotification,
    getUserById,
    login,
    logout,
    protect,
    restrictTo, setCustomerId, setRecepiantId,
    signup, updateNoticationsSeen, updateUser
} from "../controllers";
const router=Router();

// Configure passport
passport.serializeUser(serializeHandler);
passport.deserializeUser(deserializeHandler);

passport.use(new GoogleStrategy(googleStrategyOptions,
    verifyUser
));


// Auth Routes
router.post('/login',login)
router.post('/signup',signup)
router.use(protect);
router.post('/logout',logout)
router.delete("/deleteMe",deleteMe)
router.get("/me",getMe,getUserById);
router.get("/my-orders",setCustomerId,getAllOrders);
router.get("/my-notifications",setRecepiantId,getMyNotification,updateNoticationsSeen);
router.delete("/my-notifications",deleteMyNotification);
router.get("/my-complaints",restrictTo('customer'),setCustomerId,getAllComplaints);



router.get("/",restrictTo('admin'),getAllUsers)
router.get("/:id",restrictTo('admin'),getUserById)
router.post('/',restrictTo('admin'),createUser)
router.delete('/:id',restrictTo('admin'),deleteUser)
router.delete('/:id',restrictTo('admin'),updateUser)

router.use(passport.authenticate('session'));
router.get('/login/google', passport.authenticate('google'));
router.get('/oauth2/redirect/google',
    passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
    function(req, res) {
        res.redirect('/');
    });

// router.post('/logout-google',logout);

export {router as userRoute}