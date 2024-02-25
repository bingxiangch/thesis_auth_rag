// Author: Michel Leermakers
import React, { useState } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import { Button } from '@tremor/react'
import api from '../common/api'
import { useAuth } from '../common/AuthProvider'

export const EditModal = ({ open, onClose, clickedUser }) => {
  const { handleLogout } = useAuth()
  const [validationMessage, setValidationMessage] = useState(null)
  const [showErrMsg, setShowErrMsg] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const initFormData = Object.freeze({
    username: '',
    access_level: ''
  })
  const [formData, updateFormData] = useState(initFormData)

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    })
  }

  const closeAndInit = () => {
    updateFormData(initFormData)
    onClose()
  }

  const handleSaveChanges = () => {
    if (formData.password === formData.confirmpassword) {
      let editedUser = {}
      editedUser.username = clickedUser.username
      editedUser.access_level = formData.access_level
    
      handleEdit(editedUser, false)
    } else {
      setShowErrMsg(false)
      setValidationMessage('Passwords do not match!')
    }
  }

  const handleEdit = async (props, logOut) => {
    setErrorMessage(null)
    setLoading(true)
    const data = {
      username: props.username,
      access_level: parseInt(props.access_level),  // Assuming access_level is an integer
    };
    api
      .put(`http://localhost:8001/v1/users/${clickedUser.username}`, data)
      .then((res) => {
        if (logOut) {
          handleLogout()
        } else {
          closeAndInit()
        }
      })
      .catch((err) => {
        console.log('Error encountered.', err)
        setErrorMessage('Network error.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (!open) return null
  return (
    <>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Edit user</h3>
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-toggle="popup-modal"
                onClick={onClose}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto px-20">
              <form>
                <div className="mt-4">
                  <div>
                    <label id="edit-username-label" className="block text-left">
                      Username: {clickedUser.username}
                    </label>
                    <label className="block mt-4 text-left">Access Level:</label>
                    <select
                      id="access_level"
                      name="access_level"
                      onChange={handleChange}
                      defaultValue={clickedUser.access_level}
                      className="block w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                    {[...Array(10)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                    </select>
                  </div>
                </div>
              </form>
              <p className="mt-4 text-red-600">
                {showErrMsg ? errorMessage : validationMessage}
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b space-x-5">
              <ClipLoader
                color={'#000000'}
                loading={loading}
                size={36}
                className="mt-4"
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <Button
                text="Save changes"
                type="submit"
                icon={undefined}
                iconPosition="center"
                size="sm"
                color="blue"
                importance="primary"
                handleClick={handleSaveChanges}
                marginTop="mt-6"
              />
              <Button
                text="Close"
                importance="secondary"
                icon={undefined}
                iconPosition="center"
                size="sm"
                color="red"
                handleClick={closeAndInit}
                marginTop="mt-6"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}
