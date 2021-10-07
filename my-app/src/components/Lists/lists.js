import React, {useRef} from 'react';
import { Form, Loader, Checkbox, Button, TextArea, Card, Icon, Menu, Sidebar, Grid } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import { useParams, NavLink } from 'react-router-dom';
import './temp1.css';
import AddList from './addList';
import EditList from './editList';
import AddCard from '../Cards/addcards'
import CardPopup from './cardPopup';

const Lists = () => {
    const params = useParams();
    const projectId = params.projectId
    const [projects, setProjects] = React.useState([]);
    const [curProject, setCurProject] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const [lists, setLists] = React.useState([]);
    
    async function fetchProjectList() {
        axios
            .get('http://localhost:3000/keepTrack/project/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setProjects(response.data)
                fetchProjectDetails();
            })
            .catch((error) => console.log(error));
    }
    
    async function fetchUserList() {
        await axios
            .get('http://localhost:3000/keepTrack/user/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setUsers(response.data)
                fetchProjectList();
            })
            .catch((error) => console.log(error));
    }
    
    function fetchProjectDetails() {
        axios
            .get('http://localhost:3000/keepTrack/project/'+projectId+'/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setCurProject(response.data)
                // fetchListsOfproject();
            })
            .catch((error) => console.log(error));
    }

    function fetchListsOfproject() {
        axios
            .get('http://localhost:3000/keepTrack/project/'+projectId+'/list', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                console.log(response.data)
                setLists(response.data)
            })
            .catch((error) => console.log(error));
    }

    function handleDeleteEvent(id) {
        axios
            .delete("http://localhost:3000/keepTrack/list/"+ id +"/", {
                headers: {"X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
                fetchListsOfproject();
            })
            .catch((err) => {
                console.log("hemlo")
                console.log(err);
            });
    };

    React.useEffect(()=>{
        fetchUserList();
        fetchListsOfproject();
    }, []);

    function callFetchFunction (a) {
        if(a===true){
            a = false;
            fetchListsOfproject();
        }
    }

    return(
        <div className='container-list'>
            <div className='header'>
                <div className='heading'>
                    <h1 className='heading'>
                        {
                            (curProject==='')?(<Loader/>):(curProject.project_name)
                        }
                    </h1>
                </div>
                <div className='addList'>
                        <div >
                            <AddList page = {1} refreshProjectList = {callFetchFunction} id={curProject.id} project_name={curProject.project_name}  />
                        </div>
                </div>
            </div>
            <div className="listBox">
                <Grid container columns={3} className='grid-l'>
                {lists.map(function(list, index){
                    return(
                        <div key={list.id} className='list-cards'>
                            <Card className={(list.is_completed)?'card-green':'card-red'} >
                            <Card.Content>
                            <AddCard page={2} users={users} refreshProjectList = {callFetchFunction} projectId={curProject.id} listId={list.id} project_name={curProject.project_name} list_name={list.list_name} />
                                <div className='card-header'><NavLink to={"/project/"+curProject.id+"/list/"+list.id+"/cards"}>{list.list_name}</NavLink></div>
                                <br></br>
                            </Card.Content>
                            {list.cardsOfList.map(function(card){
                                return(
                                    <div key={card.id} className='card-cards-l'>
                                        <CardPopup card = {card} users={users}/>
                                    </div>
                            )})}
                            <Card.Content extra>
                                <div className='card-content-extra'>
                                    <EditList refreshProjectList = {callFetchFunction} listDetails = {list} project_name = {curProject.project_name}/>
                                    <Button className='edit-delete' floated='right' color='red' basic circular onClick={() => handleDeleteEvent(list.id)}>
                                        <Icon name='dont' />Delete
                                    </Button>
                                </div>
                            </Card.Content>
                            </Card>
                        </div>
                        
                    )
                })}
                </Grid>
            </div>
        </div>
    );
}

export default Lists;