"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/change-password', authController_1.authenticateToken, authController_1.changePassword);
router.get('/verify', authController_1.authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Токен действителен', user: req.user });
});
router.get('/profile', authController_1.authenticateToken, authController_1.getProfile);
router.get('/profile/:userId', authController_1.authenticateToken, authController_1.getProfileForAdmin);
router.post('/profile', authController_1.authenticateToken, authController_1.createOrUpdateProfile);
router.put('/profile', authController_1.authenticateToken, authController_1.createOrUpdateProfile);
router.get('/admin-check', authController_1.authenticateToken, (0, authController_1.authorizeRole)('admin'), (req, res) => {
    res.status(200).json({ message: 'Доступ разрешен', user: req.user });
});
router.get('/users', authController_1.authenticateToken, (0, authController_1.authorizeRole)('admin'), authController_1.getAllUsersForAdmin);
router.get('/users/profiles', authController_1.authenticateToken, (0, authController_1.authorizeRole)('admin'), authController_1.getAllUserProfilesForAdmin);
router.post('/family-members', authController_1.authenticateToken, authController_1.addFamilyMember);
router.put('/family-members/:id', authController_1.authenticateToken, authController_1.updateFamilyMember);
router.delete('/family-members/:id', authController_1.authenticateToken, authController_1.deleteFamilyMember);
exports.default = router;
