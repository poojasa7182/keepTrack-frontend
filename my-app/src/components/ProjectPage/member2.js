import React from 'react';
import { Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import Avatar from 'react-avatar';

const Member = (props) => {
    const user = props.user
    
    return(
        <div>
            <Button as={NavLink} to={'/user/'+user.id+'/details/'} size='tiny' className='members-button-color'>
                <Avatar value={user.name} name={user.name} src='' round={true} size={25}/> &nbsp;
            </Button>
        </div>
    )
};

export default Member;