import React, {useRef} from 'react';
import './temp.css';
import { Form, Checkbox, Button, TextArea, Card, Icon, Menu, Sidebar, Grid } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import AddProject from './addProject'
import EditProject from './editProject'

const Project = () => {
    
    const [projects, setProjects] = React.useState([]);
    const [editList, setEditList] = React.useState();
    const [users, setUsers] = React.useState([]);
    var done = false;
    async function fetchProjectList() {
        axios
            .get('http://localhost:3000/keepTrack/project/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setProjects(response.data)
                
            })
            .catch((error) => console.log(error));
    }
    
    async function fetchUserList() {
        await axios
            .get('http://localhost:3000/keepTrack/user/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setUsers(response.data)
                // console.log("ha aaya toh hu hi");
                // console.log(users)
                fetchProjectList();
            })
            .catch((error) => console.log(error));
    }

    React.useEffect(()=>{
        fetchUserList();
    }, []);

    function handleDeleteEvent(id) {
        axios
            .delete("http://localhost:3000/keepTrack/project/"+ id +"/", {
                headers: {"X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
                fetchProjectList();
            })
            .catch((err) => {
                console.log("hemlo")
                console.log(err);
            });
    };

    function callFetchFunction (a) {
        if(a===true){
            a = false;
            fetchProjectList();
        }
    }

    function emptyTheEdit (a) {
        if(a===true){
            a = false;
            setEditList();
            console.log("heiii")
            fetchProjectList();
        }
    }

    const members = users.map((user)=>({
        key : user.id,
        value : user.id,
        label : user.username,
        text : user.username
    }))
    
    function getMembers(members_p){
        let memberList = []
        members_p.map(user =>{
            users.map(item=>{
                if(item.id==user){
                    memberList.push(item.username)
                }
            })
        })
        return memberList
    }

    function getCreator(members_p){
        let name = ''
            users.map(item=>{
                if(item.id==members_p){
                    name =  (item.username)
                }
            })
        return name
    }
    var activeProj = [];
    var data;
    function fetchProjectDetails(projectId) {
        axios
            .get('http://localhost:3000/keepTrack/project/'+projectId+'/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                //console.log(response.data)
                //console.log(users)
                activeProj = response.data
                data = {
                    Proj : activeProj,
                    usersAll : users,
                    projectId : projectId
                }
                //console.log(data)
                done = true;
                handleEditEvent2(projectId);
                // document.getElementById('editButton').click();
            })
            .catch((error) => console.log(error));
    }

    function handleEditEvent2() {
        if(done === true){
            done = false;
            //console.log("hi");
            setEditList(<EditProject data = {data} refreshProjectList = {emptyTheEdit}/>);
            return;
        }
       
    };
    
    function handleEditEvent(id) {
        //console.log(id)
        fetchProjectDetails(id);
        if(done === true){
            done = false;
            //console.log("hi");
            return;
        }
        
    };

    return(
 
        <div className='container-proj'>
            <div className='header'>
                <div className='heading'>
                    <h1 className='heading'>
                        Projects
                    </h1>
                </div>
                <div className='addProj'>
                        <div >
                            <AddProject refreshProjectList = {callFetchFunction}   />
                        </div>
                        <div>
                            Add Project
                        </div>
                </div>
            </div>
            <div className="projectBox">
                <Grid container columns={3}>
                {projects.map(function(project, index){
                    return(
                        
                        <div key={project.id} className='project-cards'>
                            <Card className={(project.is_completed)?'card-green':'card-red'} >
                            <Card.Content>
                                <Button
                                color='teal'
                                circular
                                floated='right'
                                size='mini'
                                > 
                                    Add List
                                </Button>
                                <div className='card-header'>{project.project_name}</div>
                                <br></br>
                                <div className='card-content-extra'><strong>Created by: </strong>{getCreator(project.creator)}</div>
                                <Card.Description>
                                    {project.wiki}
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='card-content-extra'>
                                <Card.Description>
                                    <strong>Start Date:</strong>{project.start_date}
                                    <br></br>
                                    <strong>Due Date:</strong>{project.due_date}
                                </Card.Description>
                                </div>
                                
                            </Card.Content>
                            <Card.Content extra>
                                <div className='card-content-extra'>
                                <Card.Description>
                                    <strong>Members: </strong>{' '+getMembers(project.members_p)+' '}
                                    <br></br>
                                    <strong>Project admins: </strong>{getMembers(project.project_admins)+' '}
                                </Card.Description>
                                <br></br>
                                <Button className='edit-delete' floated='left' basic color='yellow' onClick={() => handleEditEvent(project.id)}>
                                    <Icon name='edit' /> Edit
                                </Button>
                                <Button className='edit-delete' floated='right'basic color='red' onClick={() => handleDeleteEvent(project.id)}>
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
            <div className='footer'>
                Footer
            </div>
            {editList}
        </div>
    );
     
}

export default Project;