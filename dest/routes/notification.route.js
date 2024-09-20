"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.notificationRoute = router;
router.use(controllers_1.protect);
router.delete('/:id', controllers_1.canDeleteNotification, controllers_1.deleteNotificationById);
