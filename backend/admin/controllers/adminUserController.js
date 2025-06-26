import Users from '../../models/users.js';
import UnverifiedUsers from '../../models/unverifiedUsers.js';
import bcrypt from 'bcrypt';

// List all users (verified and unverified)
export const renderUserList = async (req, res) => {
  try {
    // Get all verified users
    const verifiedUsers = await Users.findAll({ where: { verified: true } });
    // Get all unverified users from both tables
    const unverifiedInUsers = await Users.findAll({ where: { verified: false } });
    const unverifiedInUnverified = await UnverifiedUsers.findAll();

    // Unify unverified users for display
    const allUnverified = [
      ...unverifiedInUsers.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        verified: false,
        source: 'users'
      })),
      ...unverifiedInUnverified.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        verified: false,
        source: 'unverified'
      }))
    ];

    res.render('users', {
      verifiedUsers,
      unverifiedUsers: allUnverified,
      activePage: 'users'
    });
  } catch (err) {
    res.status(500).send('Error loading users');
  }
};

// Render add user form
export const renderAddUser = (req, res) => {
  res.render('userForm', {
    user: {},
    formAction: '/admin/users/add',
    formTitle: 'Add User',
    activePage: 'users'
  });
};

// Handle add user
export const handleAddUser = async (req, res) => {
  try {
    const { username, email, password, verified } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    if (verified === 'on') {
      await Users.create({ username, email, password: hashPassword, verified: true });
    } else {
      await UnverifiedUsers.create({ username, email, password: hashPassword });
    }
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Failed to add user');
  }
};

// Render edit user form (only for users table)
export const renderEditUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.render('userForm', {
      user,
      formAction: `/admin/users/edit/${user.id}?_method=PUT`,
      formTitle: 'Edit User',
      activePage: 'users'
    });
  } catch (err) {
    res.status(500).send('Error loading user');
  }
};

// Handle edit user (only for users table)
export const handleEditUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return res.status(404).send('User not found');
    user.username = req.body.username;
    user.email = req.body.email;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    user.verified = req.body.verified === 'on';
    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Failed to update user');
  }
};

// Activate user (move from unverified_users or set verified=true)
export const handleActivateUser = async (req, res) => {
  try {
    const { id, source } = req.body;
    if (source === 'unverified') {
      // Move user from UnverifiedUsers to Users and set verified=true
      const unverified = await UnverifiedUsers.findByPk(id);
      if (!unverified) return res.status(404).send('User not found');
      await Users.create({
        username: unverified.username,
        email: unverified.email,
        password: unverified.password,
        verified: true
      });
      await unverified.destroy();
    } else if (source === 'users') {
      await Users.update({ verified: true }, { where: { id } });
    }
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Failed to activate user');
  }
};

// Deactivate user (set verified=false in users table)
export const handleDeactivateUser = async (req, res) => {
  try {
    const { id } = req.body;
    await Users.update({ verified: false }, { where: { id } });
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Failed to deactivate user');
  }
};
