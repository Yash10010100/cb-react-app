import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PageLoader from './ui/PageLoader'

function AuthContainer({
    children,
    authentication = true,
    role = ""
}) {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const status = useSelector((state) => (state.auth.isAuthenticated))
    const userdata = useSelector((state) => (state.auth.user))
    const userRole = useSelector(state => state.auth.role)

    useEffect(() => {
        setLoading(true)

        if (authentication && status !== authentication) {
            navigate("/login")
        }
        else if (!authentication && status !== authentication) {
            userRole === "student" ? navigate("/dashboard") : navigate("/organizer")
        }
        else if (role && userRole !== role) {
            userRole === "student" ? navigate("/dashboard") : navigate("/organizer")
        }

        setLoading(false)
    }, [status, userdata])

    return loading ? (
        <PageLoader />
    ) : (<>{children}</>)
}

export default AuthContainer
