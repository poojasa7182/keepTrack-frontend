import React, {useRef} from 'react';
import { Form, Checkbox, Button, TextArea, Card, Icon, Menu, Sidebar, Grid, Loader, Modal, Item } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { Redirect, NavLink } from 'react-router-dom';
import Avatar from 'react-avatar';

const Member = (props) => {
    const user = props.user
    return(
        <div>
            <Button as={NavLink} to={'/user/'+user.id+'/details/'} className='members-button-color'>
                <Avatar name={user.name} src='' round={true} size={23}/> &nbsp; &nbsp; {user.name}
            </Button>
        </div>
    )
};

export default Member;