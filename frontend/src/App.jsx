import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/register'
import Login from './pages/Login'
import Cart from './pages/Cart'
import CategoriesPage from './pages/Categories'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/cart' element={<Cart />}></Route>
        <Route path='/categories' element={<CategoriesPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App