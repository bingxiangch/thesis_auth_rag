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
} from '@tremor/react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { EditFileModel } from './EditFileModel'
import { CreateModal } from './CreateModal'
import { DeleteFileModal } from './DeleteFileModel'
import ClipLoader from 'react-spinners/ClipLoader'
import api from '../common/api'

export const DocumentsView = () => {
  const [filesData, setFilesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    // Handle file selection
    const file = event.target.files[0];
    setSelectedFile(file);
    handleAddFileClick();
  };

  const handleAddFileClick = async () => {
    // Perform API call here using fetch or your preferred HTTP client
    const apiUrl = 'http://localhost:8001/v1/ingest/file'; // Replace with your API endpoint

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // Handle successful API response
          console.log('File uploaded successfully!');
          setSelectedFile(null);
          getUsers();

        } else {
          // Handle API error
          const errorData = await response.json();
          console.error('Error:', errorData);
        }
      } catch (error) {
        console.error('Error during API call:', error);
        setError(`upload failed: ${error}`);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } else {
      // Handle case where no file is selected
      console.warn('No file selected.');
    }
  };

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
      .get('http://localhost:8001/v1/files/')
      .then((res) => {
        setFilesData(res.data)
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
      <h1 className="text-xl font-bold tr-text-left">Knowledge Bases</h1>
      <ClipLoader
        color={'#000000'}
        loading={loading}
        size={36}
        className="mt-4"
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <EditFileModel
        open={openEditModal}
        onClose={() => onModalClose('edit')}
        clickedUser={selectedUser}
      />
      <CreateModal open={openCreateModal} onClose={() => onModalClose('create')} />
      <DeleteFileModal
        open={openDeleteModal}
        onClose={() => onModalClose('delete')}
        clickedUser={selectedUser}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <Card marginTop="mt-2">
        <Flex justifyContent="justify-end">
          <Button
            text="Select File"
            color="blue"
            handleClick={() => {
              // Trigger file input click programmatically
              document.getElementById('fileInput').click();
            }}
          />
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
          {selectedFile && (
            <div className="mt-2">
              <p style={{ margin: '10px' }}>{selectedFile.name}</p>
            </div>
          )}
        <Button
        text="Upload File"
        color="green"
        handleClick={handleAddFileClick}
      />
        </Flex>
        <Table marginTop="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>FileName</TableHeaderCell>
              <TableHeaderCell>Access Level</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filesData?.map((currFile) => (
              <TableRow key={currFile.id}>

                <TableCell>{currFile.file_name}</TableCell>
                <TableCell>
                  <Badge
                    text={currFile.access_level}
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
                        setSelectedUser(currFile)
                        setOpenEditModal(true)
                      }}
                    />
                    <Button
                      text="Delete"
                      color="red"
                      Icon={TrashIcon}
                      importance="secondary"
                      handleClick={() => {
                        setSelectedUser(currFile)
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

