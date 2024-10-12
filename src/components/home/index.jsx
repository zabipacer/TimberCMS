import React from 'react'
import { useAuth } from '../../contexts/authContext'
import Dashboard from '../Dashboard'
import Add from '../add.component'

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <>
      <Dashboard/>      
        </> )
}

export default Home