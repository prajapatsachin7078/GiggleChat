import { PlusIcon } from 'lucide-react'
import React from 'react'

function UserSearchList({ searchResult }) {
    return (
        <div>
            {searchResult.length > 0 && searchResult.map((user) => (
                <div key={user.id} className="flex items-center justify-between space-x-4 py-2 border-b">
                    <div className='flex'>
                        <img src={user.avatar.url || '/fallback-avatar.png'} alt={user.name} className="h-12 w-12 rounded-full" />
                        <div className='ml-2'>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-gray-600">{user.email}</div>
                        </div>
                    </div>
                    <button className='hover:cursor-pointer border shadow-sm px-2 py-1 rounded-lg bg-green-500 text-white'>
                        Start
                    </button>
                </div>
            ))}
        </div>
    )
}

export default UserSearchList