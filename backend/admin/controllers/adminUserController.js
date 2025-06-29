import Users from '../../models/users.js';
import UnverifiedUsers from '../../models/unverifiedUsers.js';
import bcrypt from 'bcrypt';

// GET /admin/users
export const renderUserList = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Filtering
    const filter = req.query.filter || 'all'; // 'all', 'verified', 'unverified'

    let users = [];
    let total = 0;

    if (filter === 'verified') {
      total = await Users.count({ where: { verified: true } });
      users = await Users.findAll({
        where: { verified: true },
        offset,
        limit,
        order: [['id', 'ASC']]
      });
      // Mark source for the frontend
      users = users.map(u => ({ ...u.get({ plain: true }), verified: true, source: 'users' }));
    } else if (filter === 'unverified') {
      // Unverified in users table
      const unverifiedUsers = await Users.findAll({
        where: { verified: false },
        order: [['id', 'ASC']]
      });
      // Unverified in unverified_users table
      const pendingUsers = await UnverifiedUsers.findAll({ order: [['id', 'ASC']] });

      // Merge and paginate
      let allUnverified = [
        ...unverifiedUsers.map(u => ({ ...u.get({ plain: true }), verified: false, source: 'users' })),
        ...pendingUsers.map(u => ({ ...u.get({ plain: true }), verified: false, source: 'unverified' }))
      ];
      total = allUnverified.length;
      users = allUnverified.slice(offset, offset + limit);
    } else {
      // 'all' - merge verified, unverified, and pending
      const verified = await Users.findAll({
        where: { verified: true },
        order: [['id', 'ASC']]
      });
      const unverified = await Users.findAll({
        where: { verified: false },
        order: [['id', 'ASC']]
      });
      const pending = await UnverifiedUsers.findAll({ order: [['id', 'ASC']] });

      let allUsers = [
        ...verified.map(u => ({ ...u.get({ plain: true }), verified: true, source: 'users' })),
        ...unverified.map(u => ({ ...u.get({ plain: true }), verified: false, source: 'users' })),
        ...pending.map(u => ({ ...u.get({ plain: true }), verified: false, source: 'unverified' }))
      ];
      total = allUsers.length;
      users = allUsers.slice(offset, offset + limit);
    }

    const totalPages = Math.ceil(total / limit);

    res.render('users', {
      users,
      page,
      totalPages,
      total,
      filter,
      limit,
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
