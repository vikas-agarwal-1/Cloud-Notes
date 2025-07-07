import React from 'react'
import { getInitials } from '../../utils/helper.js'

const ProfileInfo = ({ onLogout }) => {
  return (
    <div className='flex items-center gap-3'>
      <div className='w-12 flex items-center justify-center h-12 rounded-full text-slate-950 font-medium bg-slate-100'> {getInitials("Vikas Agarwal")} </div>

      <div>
        <p className='text-sm font-medium'> Vikas </p>
      </div>

      <button onClick={onLogout} className='test-sm bg-red-500 p-1 rounded-md text-white hover:opacity-80'>Logout</button>

    </div>
  )
}

export default ProfileInfo
