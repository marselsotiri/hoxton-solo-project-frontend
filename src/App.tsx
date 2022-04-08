
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Register from './Pages/Register'
import Error from './Pages/Error'

import { useEffect, useState } from 'react'
import { UserType } from './types'
import Dashboard from './Pages/Dashboard'
import Edit from './Pages/Edit'

function App() {

  const [showAlert, setshowAlert] = useState<boolean>(false)

  const [isLoading, setLoading] = useState<boolean>(false)


  const [user, setUser] = useState<UserType | null>(null)

  useEffect(
    () => {
      validateUser()
    }, []
  )

  function validateUser() {

    if (localStorage.token) {
      fetch('http://localhost:4000/validate', {
        headers: {
          Authorization: localStorage.token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.error) {
            console.log('Validation failed.')
          } else {
            setUser(data)
          }
        })
    }
  }

  return (
    <div className="App">
      <Routes>
        <Route index element={<Home user={user} />}></Route>
        <Route path='/dashboard' element={<Dashboard showAlert={showAlert} setshowAlert={setshowAlert} isLoading={isLoading} setLoading={setLoading} user={user} setUser={setUser} />}></Route>
        <Route path='/register' element={<Register user={user} setUser={setUser} isLoading={isLoading} showAlert={showAlert} setshowAlert={setshowAlert} />}></Route>
        <Route path='/edit/:id' element={<Edit user={user} setUser={setUser} isLoading={isLoading} setLoading={setLoading} />}></Route>
        <Route path='/*' element={<Error />}></Route>
      </Routes>
    </div>
  )
}

export default App
