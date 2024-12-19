import React from 'react'

function UserSearchList({ searchResult,chatStartHandler }) {
    return (
        <div>
            {searchResult.length > 0 && searchResult.map((user) => (
                <div key={user._id} className="flex items-center  hover:cursor-pointer
                hover:bg-red-400 justify-between rounded-md px-1 hover:text-white space-x-4 py-2 border-b"
                    onClick={()=>{chatStartHandler(user._id)}}
                >
                    <div className='flex'>
                        <img src={user.avatar.url || '/fallback-avatar.png'} alt={user.name} className="h-12 w-12 rounded-full" />
                        <div className='ml-2'>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-gray-700">{user.email}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UserSearchList