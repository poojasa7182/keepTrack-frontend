import React, {useRef} from 'react';
import { Form, Checkbox, Button, TextArea, Card, Icon, Menu, Sidebar, Grid, Image, Segment, CardContent } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { Redirect, NavLink } from 'react-router-dom';
import './temp5.css'
import Avatar from 'react-avatar';

const Users = () => {

    const [users, setUsers] = React.useState([]);
    
    async function fetchUserList() {
        await axios
            .get('http://localhost:3000/keepTrack/user/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setUsers(response.data)
                console.log(users)
            })
            .catch((error) => console.log(error));
    }

    React.useEffect(()=>{
        fetchUserList();
    }, []);

    return(
        <div className='container-users'>
            <div className='header-u'>
                <div className='heading-u'>
                    <h1 className='heading-u'>
                        Users
                    </h1>
                </div>
            </div>
            <div className='usersBox'>
                <Grid columns={3} className='users-box'>
                    {
                        users.map(function(user){
                            return(
                                <Card as={NavLink} to={'user/'+user.id+'/details'} key={user.id} className="user-cards-uu" inverted>
                                    <Avatar name = {user.name} src='' round={true} className='avatar-uu'/>
                                    <div  className='header-uu'>{user.name}</div>  
                                    <div  className='meta-uu'>({user.username})</div> 
                                    <div  className='detail-uu'>{user.details}</div>
                                </Card>
                            )
                        })
                    }
                </Grid>
            </div>
        </div>
    );
     
}

export default Users;