import express from 'express';
import { register, login, changePassword, authenticateToken, authorizeRole, getProfile, getAllUsersForAdmin, addFamilyMember, updateFamilyMember, deleteFamilyMember, createOrUpdateProfile, getAllUserProfilesForAdmin, getProfileForAdmin } from '../controllers/authController';

const router = express.Router();

 
router.post('/register', register);
router.post('/login', login);

 
router.post('/change-password', authenticateToken, changePassword);

 
router.get('/verify', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Токен действителен', user: (req as any).user });
});

 
router.get('/profile', authenticateToken, getProfile);

 
router.get('/profile/:userId', authenticateToken, getProfileForAdmin);

 
router.post('/profile', authenticateToken, createOrUpdateProfile);
router.put('/profile', authenticateToken, createOrUpdateProfile);
 
router.get('/admin-check', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Доступ разрешен', user: (req as any).user });
});

 
router.get('/users', authenticateToken, authorizeRole('admin'), getAllUsersForAdmin);

 
router.get('/users/profiles', authenticateToken, authorizeRole('admin'), getAllUserProfilesForAdmin);

 
router.post('/family-members', authenticateToken, addFamilyMember);
router.put('/family-members/:id', authenticateToken, updateFamilyMember);
router.delete('/family-members/:id', authenticateToken, deleteFamilyMember);

export default router; 