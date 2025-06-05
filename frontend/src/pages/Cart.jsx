import axios from "axios"
import { useEffect, useState } from "react"
import { Link,useNavigate } from "react-router-dom"

const Cart = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/auth/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response)
      if (response.status === 200) {
        setUsername(response.data.user.username)
      } else {
         navigate("/login")

      }
    } catch (err) {
      navigate("/login")
      console.log(err)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div>Cart</div>
  )
}

export default Cart
