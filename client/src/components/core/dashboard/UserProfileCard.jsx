import React from 'react'


const UserProfileCard = ({ user,profileUrl }) => {
    // if (!user || !user.name || !user.whatsAppNumber || profileUrl) {
    //     return (
    //         <div className="bg-white rounded shadow p-4 flex flex-col items-center">
    //             <h3 className="font-semibold">User Profile</h3>
    //             <p className="text-gray-500">No user data available</p>
    //         </div>
    //     );
    // }
    // if (!user.profileUrl) {
    //     user.profileUrl = '/admin/dashboard/profile'; // Default profile URL
    // }
    // if (!user.whatsAppNumber) {
    //     user.whatsAppNumber = 'Not provided'; // Default WhatsApp number
    // }
    // if (!user.name) {
    //     user.name = 'Unknown User'; // Default name
    // }
    return (
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-blue-600">{user.whatsAppNumber}</p>
            <a href={profileUrl} className="text-sm text-green-600 underline mt-1" >View Profile</a>
        </div>
    );
}

export default UserProfileCard
 