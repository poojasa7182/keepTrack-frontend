import React from 'react';
import { Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import Avatar from 'react-avatar';

const Member = (props) => {
    const user = props.user
    return(
        <div>
            <Button as={NavLink} to={'/user/'+user.id+'/details/'} className='members-button-color'>
                <Avatar name={user.name} src={user.profilePic} round={true} size={23}/> &nbsp; &nbsp; {user.name}
            </Button>
        </div>
    )
};

export default Member;