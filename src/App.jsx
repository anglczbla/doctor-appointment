import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
     <Routes>
      <Route path ='/' element={<Home />}></Route>
     </Routes>
    </div>
  )
}

export default App
