import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home' 
import Profile from './pages/Profile'
import About from './pages/About'
import SignOut from './pages/SignOut'
import SignIn from './pages/SignIn'


const App = () => {
  return <BrowserRouter>
  <Routes>

  <Route path='/' element={<Home />}/>
  <Route path='/profile' element={<Profile />}/>
  <Route path='/about' element={<About />}/>
  <Route path='/signin' element={<SignIn />}/>
  <Route path='/signout' element={<SignOut />}/>

  </Routes>
  </BrowserRouter>
}

export default App