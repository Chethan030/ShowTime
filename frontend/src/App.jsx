
import './App.css'
import LoginForm from './Pages/Login'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import RegisterForm from './Pages/RegisterPage'
function App() {
 
  return (

      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginForm/>}/>
        <Route path='/user_registration/' element={<RegisterForm/>}/>
        <Route path='/home/' element={<Home/>}/>
       
      </Routes>
      
      </BrowserRouter>
   
  )
}

export default App
