// Author: Michel Leermakers
import React, { useEffect, useState } from 'react'
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
  Flex,
  Badge,
  Bold
} from '@tremor/react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../common/AuthProvider'
import { EditModal } from './EditModal'
import { CreateModal } from './CreateModal'
import { DeleteModal } from './DeleteModal'
import ClipLoader from 'react-spinners/ClipLoader'
import api from '../common/api'
import { BASE_URL } from '../config'
export const UsersView = () => {
  const { user } = useAuth()
  const [usersData, setUsersData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  let [selectedUser, setSelectedUser] = useState(null)

  const onModalClose = (modalType) => {
    if (modalType === 'edit') {
      setOpenEditModal(false)
    } else if (modalType === 'delete') {
      setOpenDeleteModal(false)
    } else if (modalType === 'create') {
      setOpenCreateModal(false)
    }
    getUsers()
  }

  const getUsers = async () => {
    setLoading(true)
    api
      .get(`${BASE_URL}users/`)
      .then((res) => {
        setUsersData(res.data)
      })
      .catch((err) => {
        console.log('Error encountered.', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <main className="bg-slate-50 p-6 sm:p-10 flex-auto">
      <h1 className="text-xl font-bold tr-text-left">Users</h1>
      <ClipLoader
        color={'#000000'}
        loading={loading}
        size={36}
        className="mt-4"
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <EditModal
        open={openEditModal}
        onClose={() => onModalClose('edit')}
        clickedUser={selectedUser}
      />
      <CreateModal open={openCreateModal} onClose={() => onModalClose('create')} />
      <DeleteModal
        open={openDeleteModal}
        onClose={() => onModalClose('delete')}
        clickedUser={selectedUser}
      />

      <Card marginTop="mt-2">
        <Flex justifyContent="justify-end">
          <Button
            text="Create user"
            color="blue"
            handleClick={() => {
              setOpenCreateModal(true)
            }}
          />
        </Flex>
        <Table marginTop="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Username</TableHeaderCell>
              <TableHeaderCell>Access Level</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersData?.map((currUser) => (
              <TableRow key={currUser.id}>
                {currUser.username === user.username ? (
                  <TableCell>
                    <Bold>{currUser.username}</Bold>
                  </TableCell>
                ) : (
                  <TableCell>{currUser.username}</TableCell>
                )}
                <TableCell>
                  <Badge
                    text={currUser.access_level}
                    // color={userColors[currUser.access_level]}
                  />
                </TableCell>
                <TableCell>
                  <Flex justifyContent="justify-end" spaceX="space-x-10">
                    <Button
                      text="Edit"
                      color="blue"
                      Icon={PencilIcon}
                      importance="secondary"
                      handleClick={() => {
                        setSelectedUser(currUser)
                        setOpenEditModal(true)
                      }}
                    />
                    <Button
                      text="Delete"
                      color="red"
                      Icon={TrashIcon}
                      importance="secondary"
                      handleClick={() => {
                        setSelectedUser(currUser)
                        setOpenDeleteModal(true)
                      }}
                    />
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  )
}
