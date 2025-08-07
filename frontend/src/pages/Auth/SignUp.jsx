import React, { useState } from 'react'
import PasswordInput from '../../components/PasswordInput'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { validateEmail } from '../../utils/helper'
import { useDispatch, useSelector } from 'react-redux'


const SignUp = () => {
  const navigate = useNavigate()
  

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const {loading,currentUser} = useSelector((state) => state.user)

  const handleSignUp = async(e) => {e.preventDefault()

    if(!name) {
      setError('Please enter your name.')
      return
    }

    if(!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if(!password) {
      setError('Password is required.')
      return
    }

    setError(null) 

    try {
      const response = await axiosInstance.post('/auth/signup', {
        username: name,
        email,
        password
      })

      if(response.data) {
        navigate('/login')
      }
      
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError('An error occurred while logging in. Please try again.')
      }
    }
  }

  React.useEffect(() => {
      if (!loading && currentUser) {
        navigate('/')
      }
    }, [currentUser])

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">

      <div className='login-ui-box right-10 -top-40' />

      <div className="container h-screen flex items-center justify-center px-20 mx-auto">

        <div className="w-2/4 h-[90vh] flex items-end bg-[url('https://images.pexels.com/photos/33038661/pexels-photo-33038661.jpeg')] bg-cover bg-center rounded-lg p-10 z-50">

          <div>
            <h4 className='text-5xl text-white font-semibold leading-[58px]'> Create Your <br /> Travel Stories</h4>

            <p className='text-[15px] text-white leading-6 pr-7 mt-4'>A Digital diary to treasure your travel memories</p>
          </div>
        </div>
        <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>

          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl font-semibold mb-7'>Create Your Account</h4> 

             <input type="text" placeholder='Enter Your Name' className='input-box' value={name} onChange={(e) => setName(e.target.value)} />

            <input type="email" placeholder='Email' className='input-box' value={email} onChange={(e) => setEmail(e.target.value)} />

            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}/>

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            {loading ? (
              <p className='animate-pulse w-full text-center btn-primary'>LOADING...</p>          
            ) : (<button type='submit' className='btn-primary'>SIGN UP</button>)}

            <p className='text-xs text-slate-500 text-center my-4'>Or</p>

            <button type="submit" className='btn-primary btn-light' onClick={() => navigate("/login")}>LOGIN</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
