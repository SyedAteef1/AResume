import { useState } from 'react'

import './App.css'
import { Navbar } from './Components/Navbar'
import HomePage from './Components/HomePage'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Resume from './Components/Resume'
function App() {
  const [count, setCount] = useState(0)
  const [name,setName]=useState("")
    return (
      <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/resume' element={<Resume/>}></Route>
  </Routes>
      </BrowserRouter>
    )
  
}

export default App
