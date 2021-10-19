import React from 'react';
import { Button, Card, Grid, Label } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import './temp5.css'
import Avatar from 'react-avatar';

const Users = () => {
    const [users, setUsers] = React.useState([]);
    const [requser, setRequser] = React.useState('');

    async function fetchUserList() {
        await axios
            .get('http://localhost:3000/keepTrack/user/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setUsers(response.data)
                console.log(users)
                fetchUserDetails();
            })
            .catch((error) => console.log(error));
    }

    async function fetchUserDetails(){
        axios
            .get('http://localhost:3000/keepTrack/user/info', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setRequser(response.data)
                console.log(requser)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    async function changeAdminStatus(id,state){
        const data = {
            is_admin : state
        };
        axios
            .patch("http://localhost:3000/keepTrack/user/"+id+"/",data, {
                headers: { 'Content-Type': 'application/json', "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
                fetchUserList();
            })
            .catch((err) => {
                console.log("hemlo")
                console.log(err);
            });
    }

    async function changeEnableStatus(id,state){
        const data = {
            banned : state
        };
        axios
            .patch("http://localhost:3000/keepTrack/user/"+id+"/",data, {
                headers: { 'Content-Type': 'application/json', "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
                fetchUserList();
            })
            .catch((err) => {
                console.log("hemlo")
                console.log(err);
            });
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
                            if(!requser.is_admin&&user.is_admin){
                                return(
                                    <Card as={NavLink} to={'user/'+user.id+'/details'} key={user.id} className="user-cards-uu" inverted>
                                        <Label attached='top left' circular size='large' color='green'>Admin</Label>
                                        {(user.banned)?(<Label attached='top left'  size='medium' color='red'>Disabled</Label>):(<div></div>)}
                                        <Avatar name = {user.name} src={user.profilePic} round={true} className='avatar-uu'/>
                                        <div  className='header-uu'>{user.name}</div>  
                                        <div  className='meta-uu'>({user.username})</div> 
                                        <div  className='detail-uu'>{user.details}</div>
                                    </Card>
                                )
                            }
                        })
                    }
                    {  
                        users.map(function(user){
                            if(!requser.is_admin&&!user.is_admin){
                                return(
                                    <Card as={NavLink} to={'user/'+user.id+'/details'} key={user.id} className="user-cards-uu" inverted>
                                        <Label attached='top left' circular size='large' color='blue'>User</Label>
                                        {(user.banned)?(<div><Label attached='top right' size='medium' color='red'>Disabled</Label></div>):(<div></div>)}
                                        <Avatar name = {user.name} src={user.profilePic} round={true} className='avatar-uu'/>
                                        <div  className='header-uu'>{user.name}</div>  
                                        <div  className='meta-uu'>({user.username})</div> 
                                        <div  className='detail-uu'>{user.details}</div>
                                    </Card>
                                )
                            }
                        })
                    }
                    {  
                        users.map(function(user){
                            if(requser.is_admin&&user.is_admin){
                                return(
                                    <Card  key={user.id} className="user-cards-uu" inverted>
                                        <Label attached='top left' circular size='large' color='green'>Admin</Label>
                                        {(user.banned)?(<div><Label attached='top right' size='medium' color='red'>Disabled</Label></div>):(<div></div>)}
                                        <Card.Content as={NavLink} to={'user/'+user.id+'/details'} className="user-cards-uu-2">
                                        <Avatar name = {user.name} src={user.profilePic} round={true} className='avatar-uu'/>
                                        <div  className='header-uu'>{user.name}</div>  
                                        <div  className='meta-uu'>({user.username})</div> 
                                        <div  className='detail-uu'>{user.details}</div>
                                        </Card.Content>
                                        <Button disabled={requser.id===user.id} onClick={() => {changeAdminStatus(user.id,0)}} color='yellow'>Remove as Admin</Button>
                                        <Button disabled={requser.id===user.id} onClick={() => changeEnableStatus(user.id,!user.banned)} color='red'>{(user.banned)?('Enable'):('Disable')}</Button>
                                    </Card>
                                )
                            }
                        })
                    }
                    {  
                        users.map(function(user){
                            if(requser.is_admin&&!user.is_admin){
                                return(
                                    <Card key={user.id} className="user-cards-uu" inverted>
                                        <Label attached='top left' circular size='large' color='blue'>User</Label>
                                        {(user.banned)?(<div><Label attached='top right' size='medium' color='red'>Disabled</Label></div>):(<div></div>)}
                                        <Card.Content as={NavLink} to={'user/'+user.id+'/details'} className="user-cards-uu-2">
                                        <Avatar name = {user.name} src={user.profilePic} round={true} className='avatar-uu'/>
                                        <div  className='header-uu'>{user.name}</div>  
                                        <div  className='meta-uu'>({user.username})</div> 
                                        <div  className='detail-uu'>{user.details}</div>
                                        </Card.Content>
                                        <Button onClick={() => {changeAdminStatus(user.id,1)}} color='yellow'>Make Admin</Button>
                                        <Button onClick={() => changeEnableStatus(user.id,!user.banned)} color='red'>{(user.banned)?('Enable'):('Disable')}</Button>
                                    </Card>
                                )
                            }
                        })
                    }
                </Grid>
            </div>
        </div>
    );
     
}

export default Users;