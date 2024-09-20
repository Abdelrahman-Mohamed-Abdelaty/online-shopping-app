"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const passport_1 = __importDefault(require("passport"));
// @ts-ignore
const passport_google_oidc_1 = __importDefault(require("passport-google-oidc"));
const express_1 = require("express");
const utility_1 = require("../utility");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.userRoute = router;
// Configure passport
passport_1.default.serializeUser(utility_1.serializeHandler);
passport_1.default.deserializeUser(utility_1.deserializeHandler);
passport_1.default.use(new passport_google_oidc_1.default(utility_1.googleStrategyOptions, utility_1.verifyUser));
// Auth Routes
router.post('/login', controllers_1.login);
router.post('/signup', controllers_1.signup);
router.use(controllers_1.protect);
router.post('/logout', controllers_1.logout);
router.delete("/deleteMe", controllers_1.deleteMe);
router.get("/me", controllers_1.getMe, controllers_1.getUserById);
router.get("/my-orders", controllers_1.setCustomerId, controllers_1.getAllOrders);
router.get("/my-notifications", controllers_1.setRecepiantId, controllers_1.getMyNotification, controllers_1.updateNoticationsSeen);
router.delete("/my-notifications", controllers_1.deleteMyNotification);
router.get("/my-complaints", (0, controllers_1.restrictTo)('customer'), controllers_1.setCustomerId, controllers_1.getAllComplaints);
router.get("/", (0, controllers_1.restrictTo)('admin'), controllers_1.getAllUsers);
router.get("/:id", (0, controllers_1.restrictTo)('admin'), controllers_1.getUserById);
router.post('/', (0, controllers_1.restrictTo)('admin'), controllers_1.createUser);
router.delete('/:id', (0, controllers_1.restrictTo)('admin'), controllers_1.deleteUser);
router.delete('/:id', (0, controllers_1.restrictTo)('admin'), controllers_1.updateUser);
router.use(passport_1.default.authenticate('session'));
router.get('/login/google', passport_1.default.authenticate('google'));
router.get('/oauth2/redirect/google', passport_1.default.authenticate('google', { failureRedirect: '/login', failureMessage: true }), function (req, res) {
    res.redirect('/');
});
