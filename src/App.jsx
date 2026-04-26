import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser, refreshAccessTokens } from './features/auth';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/authSlice';
import PageLoader from './components/ui/PageLoader';

function App() {
  // const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const status = useSelector(state => state.auth.isAuthenticated)

  useEffect(() => {
    if (!status) {
      getCurrentUser()
        .then((res) => {
          dispatch(login({ user: res.data, role: res.data.role.toLowerCase() }))
          setTimeout(() => {
            setLoading(false)
          }, 500)
        })
        .catch((err) => {
          refreshAccessTokens()
            .then((res) => {
              dispatch(login({ user: res.data.user, role: res.data.user.role.toLowerCase() }))
              setTimeout(() => {
                setLoading(false)
              }, 500)
            })
            .catch((err) => {
              setTimeout(() => {
                setLoading(false)
              }, 500)
            })
        })
    }
  }, [status])

  return loading ? (
    <PageLoader />
  ) : (
    <Outlet />
  );
}

export default App;
