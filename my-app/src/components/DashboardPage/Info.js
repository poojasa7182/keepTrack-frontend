import React, {useRef} from 'react';
import { Form, Checkbox, Button, TextArea, Card, Icon, Menu, Sidebar, Grid, Image, Segment } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { Redirect, NavLink } from 'react-router-dom';
import imgLoad from './route (1).png'
import './temp4.css'
import EditCard from '../Cards/editcards'
import Avatar from 'react-avatar';

const UserInfo = () => {
    
    const [userInfo, setUserInfo] = React.useState([]);
    const [menu, setMenu] = React.useState('cards');
    const [userCards, setUserCards] = React.useState([]);
    const [userProjects, setUserProjects] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    
    async function fetchUserList() {
        await axios
            .get('http://localhost:3000/keepTrack/user/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setUsers(response.data)
            })
            .catch((error) => console.log(error));
    }

    const handleMenuChange = (e,{name}) => {
        setMenu(name)
    }
    
    async function fetchUserDetails() {
        await axios
            .get('http://localhost:3000/keepTrack/user/info', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                // console.log(response.data)
                setUserInfo(response.data)
                fetchUsercards()
            })
            .catch((error) => console.log(error));
    }

    async function fetchUsercards() {
        await axios
            .get('http://localhost:3000/keepTrack/user/cards', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                console.log(response.data)
                setUserCards(response.data)
                fetchUserProjects()
            })
            .catch((error) => console.log(error));
    }

    async function fetchUserProjects() {
        await axios
            .get('http://localhost:3000/keepTrack/user/projects', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                console.log(response.data)
                setUserProjects(response.data)
            })
            .catch((error) => console.log(error));
    }
    
    React.useEffect(()=>{
        fetchUserDetails();
        fetchUserList();
    }, []);
    
    function handleDeleteEvent(id) {
        axios
            .delete("http://localhost:3000/keepTrack/card/"+ id +"/", {
                headers: {"X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
                fetchUsercards();
            })
            .catch((err) => {
                console.log("hemlo")
                console.log(err);
            });
    };

    const callFetchFunction=(a)=>{
        if(a===true){
            a=false
            fetchUsercards();
        }
        return
    }

    return(
        <div className='container-dashboard'>
            <div className='header-i'>
                <div className='heading-i'>
                    <h1 className='heading-i'>
                        DashBoard
                    </h1>
                </div>
            </div>
            <div className="infoBox">
                <Card className='card-info'>
                    <Card.Content>
                    <Avatar className='avtar-info' value={userInfo.name} name={userInfo.name} src='' round={true} size={180} textSizeRatio={1} /> &nbsp;
                        {/* <Image floated='left' circular src='https://channeli.in/media/maintainer_site/normie_image/bfd02081-129d-470e-988a-949f6a0a5894.png' size='small'  /> */}
                        <div className='card-header-i' >
                            {userInfo.name} 
                        </div>
                        <br></br>
                        <div className='card-header-i2' >
                            ( {userInfo.username} )<br></br><br></br>
                            {userInfo.details}
                        </div>
                    </Card.Content>
                </Card>
                <Menu pointing inverted widths={2}> 
                    <Menu.Item
                        name='cards'
                        active={menu === 'cards'}
                        onClick={handleMenuChange}
                    />
                    <Menu.Item
                        name='projects'
                        active={menu === 'projects'}
                        onClick={handleMenuChange}
                    />
                </Menu>
                <Segment inverted>
                    {(menu==='cards')?
                    (
                        <div className='user-cards-container'>
                            <Grid columns={3} className='user-cards-box'>
                            {userCards.map(function(card){
                                return(
                                    <Card key={card.id} className={(card.is_completed)?'card-green-i':'card-red-i'}>
                                        <Card.Header className='user-card-header'>{card.card_name}</Card.Header>
                                        <Card.Description>{card.description}</Card.Description>
                                        <Card.Content extra>
                                            <div className='card-content-extra-i'>
                                            <Card.Description>
                                                <strong>Start Date:</strong>{card.start_date}
                                                <br></br>
                                                <strong>Due Date:</strong>{card.due_date}
                                            </Card.Description>
                                            </div>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <div className='card-content-extra-i'>
                                            <EditCard page={1} card = {card} users = {users} project_name={card.project_c.project_name} list_name={card.list_c.list_name} refreshProjectList = {callFetchFunction}/>
                                            <Button className='edit-delete-c' floated='right'basic color='red' onClick={() => handleDeleteEvent(card.id)}>
                                                <Icon name='dont' />Delete
                                            </Button> 
                                            </div>
                                        </Card.Content>
                                        <Card.Content className='user-card-description'>
                                            <Button color='teal' as={NavLink} to={'project/'+card.project_c.id+'/lists'}><strong>Project : </strong>{card.project_c.project_name}</Button>
                                            <br></br>
                                            <Button color='teal' as={NavLink} to={'project/'+card.project_c.id+'/list/'+card.list_c.id+'/cards'}><strong>list : </strong>{card.list_c.list_name}</Button>
                                        </Card.Content>
                                    </Card>
                            )})}
                            </Grid>
                        </div>
                    ):(
                        <div className='user-cards-container'>
                            <Grid columns={3} className='user-cards-box'>
                            {userProjects.map(function(card){
                                return(
                                    <Card className={(card.is_completed)?'card-green-i':'card-red-i'}>
                                        <Button color='teal' as={NavLink} to={'project/'+card.id+'/lists'}>View project</Button>
                                        <br></br>
                                        <Card.Header className='user-card-header'>{card.project_name}</Card.Header>
                                        <Card.Description>{card.wiki}</Card.Description>
                                    </Card>
                            )})}
                            </Grid>
                        </div>
                    )}
                </Segment>
            </div>
        </div>
    );
     
}

export default UserInfo;