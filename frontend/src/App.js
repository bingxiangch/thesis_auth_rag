import './App.css'
import '@tremor/react/dist/esm/tremor.css'

import { Routes, Route } from 'react-router-dom'

import { AuthProvider } from './common/AuthProvider'
import { ProtectedRoute } from './common/ProtectedRoute'
import { LoginView } from './components/LoginView'
import { UsersView } from './components/UsersView'
import { DocumentsView } from './components/DocumentsView'
import { ChatView } from './components/ChatView'

import { useEffect } from 'react'
import "./App.css";
import AppHeader from "./components/AppHeader";
import SideMenu from "./components/SideMenu";

function App() {
  useEffect(() => {
    document.title = 'Authr-based RAG'
  })
  return (
    <div className="App flex flex-col h-screen justify-between">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AppHeader />
                <div className="SideMenuAndPageContent">
                  <SideMenu></SideMenu>
                  <UsersView></UsersView>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <AppHeader />
                <div className="SideMenuAndPageContent">
                  <SideMenu></SideMenu>
                  <DocumentsView></DocumentsView>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <AppHeader />
                <div className="SideMenuAndPageContent">
                  <SideMenu></SideMenu>
                  <ChatView></ChatView>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <AppHeader />
                <div className="SideMenuAndPageContent">
                  <SideMenu></SideMenu>
                  <ChatView></ChatView>
                </div>
              </ProtectedRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
