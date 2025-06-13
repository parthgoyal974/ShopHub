import { 
  registerUser,
  loginUser,
  getAuthenticatedUser
} from '../services/authServices.js';
// Register user
const userRegister = async (req, res) => {
  try {
    const { user, token } = await registerUser(req.body);
    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    const status = err.message.includes('exists') ? 409 : 500;
    res.status(status).json({ message: err.message });
  }
}

const userLogin = async (req, res) => {
  try {
    const token = await loginUser(req.body);
    res.status(200).json({ token });
  } catch (err) {
    const status = err.message.includes('found') ? 404 : 
                   err.message.includes('password') ? 401 : 500;
    res.status(status).json({ message: err.message });
  }
}

// Home route
const home = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req.userId);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}


export {
  userRegister,
  userLogin,
  home
};
