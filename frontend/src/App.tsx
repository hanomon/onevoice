import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import InitialPage from './pages/InitialPage'
import HomePage from './pages/HomePage'
import UserModePage from './pages/UserModePage'
import AdminModePage from './pages/AdminModePage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/user" element={<UserModePage />} />
          <Route path="/admin" element={<AdminModePage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

