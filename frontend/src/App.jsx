import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/register'
import Login from './pages/Login'
import Cart from './pages/Cart'
import CategoriesPage from './pages/Categories'
import ProductsPage from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Orders from './pages/orders'
import Contact from './pages/Contact'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>

        <Route path='/cart' element={<Cart />}></Route>
        <Route path='/categories' element={<CategoriesPage />}></Route>
        <Route path='/products' element={<ProductsPage/>}></Route>
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="orders" element={<Orders/>}/>
        <Route path="/contact" element={<Contact/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App