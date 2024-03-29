// Author: Michel Leermakers
import React, { useState } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import { Button, Flex } from '@tremor/react'
import api from '../common/api'
import { useAuth } from '../common/AuthProvider'
import { BASE_URL } from '../config'
export const DeleteModal = ({ open, onClose, clickedUser }) => {
  const { handleLogout, user } = useAuth()
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    // Reseting error message
    setErrorMessage(null)
    setLoading(true)
    api
      .delete(`${BASE_URL}users/${clickedUser.username}`)
      .then((res) => {
        if (clickedUser.username === user.username) {
          handleLogout()
        } else {
          closeAndInit()
        }
      })
      .catch((err) => {
        setErrorMessage('Network error.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const closeAndInit = () => {
    setErrorMessage(null)
    onClose()
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
              <h3 className="text-3xl font-semibold">Delete user</h3>
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
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto px-20">
              <div className="block mt-4">
                Are you sure you want to delete user {clickedUser.username}?
                <div className="mt-10 space-x-5">
                  <Flex justifyContent="justify-around">
                    <ClipLoader
                      color={'#000000'}
                      loading={loading}
                      size={36}
                      className="mt-4"
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                    <Button
                      text="Delete"
                      icon={undefined}
                      iconPosition="center"
                      size="sm"
                      color="red"
                      importance="primary"
                      handleClick={handleDelete}
                      marginTop="mt-6"
                    />
                    <Button
                      text="Cancel"
                      importance="secondary"
                      icon={undefined}
                      iconPosition="center"
                      size="sm"
                      color="blue"
                      handleClick={closeAndInit}
                      marginTop="mt-6"
                    />
                  </Flex>
                </div>
              </div>
              <p className="mt-4 text-red-600">{errorMessage}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}
