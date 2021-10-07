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
           
            <Button as={NavLink} to={'/user/'+user.id+'/details/'} size='tiny' className='members-button-color'>
                <Avatar value={user.name} name={user.name} src='' round={true} size={23}/> &nbsp;
            </Button>
        </div>
    )
};

export default Member;