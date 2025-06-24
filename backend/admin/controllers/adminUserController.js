import Users from '../../models/users.js';

// List all users
export const renderUserList = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.render('users', { users, activePage: 'users' });
  } catch (err) {
    console.log(err)
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
    await Users.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // In production, hash the password!
      verified: req.body.verified === 'on' // Checkbox for verified status
    });
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Failed to add user');
  }
};

// Render edit user form
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

// Handle edit user
export const handleEditUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return res.status(404).send('User not found');
    user.username = req.body.username;
    user.email = req.body.email;
    // Only update password if provided
    if (req.body.password) user.password = req.body.password; // Hash in production!
    user.verified = req.body.verified === 'on';
    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Failed to update user');
  }
};

// Handle delete user
export const handleDeleteUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return res.status(404).send('User not found');
    await user.destroy();
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Failed to delete user');
  }
};
