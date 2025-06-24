import express from 'express';
import {
  renderUserList,
  renderAddUser,
  handleAddUser,
  renderEditUser,
  handleEditUser,
  handleDeleteUser
} from '../controllers/adminUserController.js';

const router = express.Router();

router.get('/', renderUserList);
router.get('/add', renderAddUser);
router.post('/add', handleAddUser);
router.get('/edit/:id', renderEditUser);
router.put('/edit/:id', handleEditUser);
router.post('/edit/:id', handleEditUser); // fallback for method-override
router.post('/delete/:id', handleDeleteUser);

export default router;
