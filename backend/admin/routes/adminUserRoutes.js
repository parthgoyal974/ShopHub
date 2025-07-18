import express from 'express';
import {
  renderUserList,
  renderAddUser,
  handleAddUser,
  renderEditUser,
  handleEditUser,
  handleActivateUser,
  handleDeactivateUser
} from '../controllers/adminUserController.js';

const router = express.Router();

router.get('/', renderUserList);
router.get('/add', renderAddUser);
router.post('/add', handleAddUser);
router.get('/edit/:id', renderEditUser);
router.put('/edit/:id', handleEditUser);
router.post('/edit/:id', handleEditUser);
router.post('/activate', handleActivateUser);
router.post('/deactivate', handleDeactivateUser);

export default router;
