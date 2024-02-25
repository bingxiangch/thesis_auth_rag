// Author: Oskari Niskanen
import React, { useState } from 'react'
import { useAuth } from '../common/AuthProvider'
import { Button, Flex } from '@tremor/react'
import ClipLoader from 'react-spinners/ClipLoader'

export const LoginView = () => {
  const { handleLogin, err, loading } = useAuth()

  const initFormData = Object.freeze({
    username: '',
    password: ''
  })
  // Saving form data to state
  const [formData, updateFormData] = useState(initFormData)
  const [validationMessage, setValidationMessage] = useState(null)
  const [showErrMsg, setShowErrMsg] = useState(null)
  // Change handler for both input fields
  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    })
  }
  // Click handler for login button
  const handleLoginClick = (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    if (formData.username && formData.password) {
      setValidationMessage(null)
      setShowErrMsg(true)
      handleLogin(formData)
    } else {
      setShowErrMsg(false)
      setValidationMessage('Empty input field value(s).')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Login to your account</h3>
        <form>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">
                Username
              </label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <input
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <p className="mt-4 text-red-600">{showErrMsg ? err : validationMessage}</p>
            <Flex justifyContent="justify-between" spaceX="space-x-2">
              <Button
                text="Login"
                type="submit"
                icon={undefined}
                iconPosition="center"
                size="md"
                color="blue"
                importance="primary"
                handleClick={handleLoginClick}
                marginTop="mt-6"
              />
              <ClipLoader
                color={'#000000'}
                loading={loading}
                size={36}
                className="mt-4"
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </Flex>
          </div>
        </form>
      </div>
    </div>
  )
}
