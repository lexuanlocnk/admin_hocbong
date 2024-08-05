import { Navigate, Outlet } from 'react-router-dom'

const useAuth = () => {
  const checkLogin = localStorage.getItem('adminvtnk')
  if (checkLogin) {
    return true
  } else {
    return false
  }
}

const PublicRoute = () => {
  const checkLogin = useAuth()
  return checkLogin ? <Navigate to="/" replace={true}/> : <Outlet />
}
export default PublicRoute