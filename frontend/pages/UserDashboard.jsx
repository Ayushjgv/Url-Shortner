// import React from 'react'

const UserDashboard = (props) => {
    console.log(props);

  return (
    <div className="text-black">
        Hello {props.User.username}
    </div>
  )
}

export default UserDashboard
