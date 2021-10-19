import React from 'react';
import { Button, Card, Menu, Grid, Segment, Label, Accordion, Icon } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { NavLink, useParams } from 'react-router-dom';
import Avatar from 'react-avatar';

const UserInfo = () => {
    const params = useParams();
    const userId = params.userId
    const [userInfo, setUserInfo] = React.useState([]);
    const [menu, setMenu] = React.useState('cards');
    const [userCards, setUserCards] = React.useState([]);
    const [userProjects, setUserProjects] = React.useState([]);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const handleMenuChange = (e,{name}) => {
        setMenu(name)
    }
    
    async function fetchUserDetails() {
        await axios
            .get('http://localhost:3000/keepTrack/user/'+userId+'/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                // console.log(response.data)
                setUserInfo(response.data)
                fetchUsercards()
            })
            .catch((error) => console.log(error));
    }

    async function fetchUsercards() {
        await axios
            .get('http://localhost:3000/keepTrack/users/'+userId+'/tasks', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                console.log(response.data)
                setUserCards(response.data)
                fetchUserProjects()
            })
            .catch((error) => console.log(error));
    }

    async function fetchUserProjects() {
        await axios
            .get('http://localhost:3000/keepTrack/users/'+userId+'/projects', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                console.log(response.data)
                setUserProjects(response.data)
            })
            .catch((error) => console.log(error));
    }
    
    React.useEffect(()=>{
        fetchUserDetails();
    }, []);

    const handleClickDesc = (e,titleProps) =>{
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index
        setActiveIndex(newIndex);
    }

    const createMarkup = (content) => {
        return {__html: content};
    }

    return(
        <div className='container-dashboard'>
            <div className='header-i'>
                <div className='heading-i'>
                    <h1 className='heading-i'>
                        Users
                    </h1>
                </div>
            </div>
            <div className="infoBox">
                <Card className='card-info'>
                    {(userInfo.banned)?(<Label attached='bottom right'  size='huge' color='red'>Disabled</Label>):(<div></div>)}                   
                    {(userInfo.is_admin)?(<Label attached='top right'  size='huge' color='green'>Admin</Label>):(<Label attached='top right'  size='huge' color='blue'>User</Label>)}                   
                    <Card.Content>
                    <Avatar className='avtar-info' value={userInfo.name} name={userInfo.name} src={userInfo.profilePic} round={true} size={180} textSizeRatio={1.75} /> &nbsp;
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
                                        <Card.Content className='user-card-description'>
                                            <Button color='teal' as={NavLink} to={'../../../project/'+card.project_c.id+'/lists'}><strong>Project : </strong>{card.project_c.project_name}</Button>
                                            <br></br>
                                            <Button color='teal' as={NavLink} to={'../../../project/'+card.project_c.id+'/list/'+card.list_c.id+'/cards'}><strong>List : </strong>{card.list_c.list_name}</Button>
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
                                    <Card key= {card.id} className={(card.is_completed)?'card-green-i':'card-red-i'}>
                                        <Button color='teal' as={NavLink} to={'../../project/'+card.id+'/lists'}>View project</Button>
                                        <br></br>
                                        <Card.Header className='user-card-header'>{card.project_name}</Card.Header>
                                        <Accordion>
                                            <Accordion.Title
                                                active = {activeIndex==card.id}
                                                index = {card.id}
                                                onClick={handleClickDesc}
                                                className='desc-accordion'
                                            >
                                                <Icon name='dropdown' />
                                            <strong>Description:</strong> 
                                            </Accordion.Title>
                                            <Accordion.Content active={activeIndex === card.id}>
                                                <Card.Description className='desc-accordion' dangerouslySetInnerHTML={createMarkup(card.wiki)}>
                                                {/* {project.wiki} */}
                                                </Card.Description>
                                            </Accordion.Content>
                                        </Accordion>
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