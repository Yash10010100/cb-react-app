import React from 'react'
import { Logo } from './'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Sidebar({
    logosize = 60,
    current
}) {

    const orgelements = [
        {
            name: "dashboard",
            to: "/user",
        },
        {
            name: "events",
            to: "/events"
        },
        {
            name: "participants",
            to: "/user/participants"
        },
        {
            name: "history",
            to: "/user/history"
        }
    ]

    const stdelements = [
        {
            name: "dashboard",
            to: "/user",
        },
        {
            name: "events",
            to: "/events"
        },
        {
            name: "preferences",
            to: "/user/preferences"
        },
        {
            name: "history",
            to: "/user/history"
        }
    ]

    const commonClasses = "text-white text-lg duration-50 hover:scale-102 active:scale-100 hover:shadow-[_0px_0px_3px_2px_rgba(0,0,0,0.4)] z-80"
    const activeClasses = "bg-[var(--accent-color)]/95 hover:bg-[var(--accent-color)]"
    const inactiveClasses = "border-y-1 border-white/20 bg-[var(--sec-color)]"

    const user = useSelector(state => state.auth.user)

    return (
        <div className=' h-full min-w-60 flex flex-col'>
            <Logo size={logosize} />
            <div className=''>
                <ul className=' w-full flex flex-col text-center'>
                    {user?.usertype === "student" ? (stdelements.map((e) => (
                        <li className={`${commonClasses} ${e.name === current ? activeClasses : inactiveClasses}`} key={e.name}><Link to={e.to}><p className=' p-3'>{e.name}</p></Link></li>
                    ))) : user?.usertype === "organizer" ? (orgelements.map((e) => (
                        <li className={`${commonClasses} ${e.name === current ? activeClasses : inactiveClasses}`} key={e.name}><Link to={e.to}><p className=' p-3'>{e.name}</p></Link></li>
                    ))) : ""
                    }
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
