import React, {useRef} from 'react';
import './temp.css';
import { Form, Checkbox, Button, TextArea, Card, Icon, Menu, Sidebar, Grid } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { Redirect, NavLink } from 'react-router-dom';
import AddProject from './addProject'
import EditProject from './editProject'
import AddList from '../Lists/addList';
import Member from './member2';

const Project = () => {
    const [projects, setProjects] = React.useState([]);
    const [users, setUsers] = React.useState([]);

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

    function callFetchFunction2 (a){
        return
    }

    function emptyTheEdit (a) {
        if(a===true){
            a = false;
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
                    name =  (item.name)
                }
            })
        return name
    }
    
    return(
        <div className='container-proj'>
            <div className='header-p'>
                <div className='heading-p'>
                    <h1 className='heading-p'>
                        Projects
                    </h1>
                </div>
                <div className='addProj'>
                        <div >
                            <AddProject refreshProjectList = {callFetchFunction}   />
                        </div>
                </div>
            </div>
            <div className="projectBox">
                <Grid  columns={3} className='projectBox2'>
                {projects.map(function(project, index){
                    return(
                        <div key={project.id} className='project-cards'>
                            <Card className={(project.is_completed)?'card-green':'card-red'} >
                            <Card.Content>
                                <AddList page={2} id={project.id} project_name={project.project_name}/>
                                <div className='card-header'><NavLink to={"/project/"+project.id+"/lists"}>{project.project_name}</NavLink></div>
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
                                    <div className='flex-div-2'>
                                    <strong>Members: &nbsp; </strong>
                                    <div className='flex-div-2'>{
                                        project.members_p.map(function(user,index){
                                            return(
                                                    users.map(function(item,index2){
                                                    if(item.id===user){
                                                        return(
                                                            // <div key = {item.id} className='flex-div-2'>
                                                                <Member key = {item.id} user = {item} />
                                                            // </div>
                                                            
                                                        )
                                                    }
                                                })
                                            )
                                        })}
                                        </div>
                                    </div>
                                    <div className='flex-div-2'>
                                    <strong>Project admins: &nbsp; </strong>
                                    <div className='flex-div-2'>{
                                        project.project_admins.map(function(user,index){
                                            return(
                                                    users.map(function(item,index2){
                                                    if(item.id===user){
                                                        return(
                                                            // <div key = {item.id} className='flex-div-2'>
                                                                <Member key = {item.id} user = {item} />
                                                            // </div>
                                                            
                                                        )
                                                    }
                                                })
                                            )
                                        })}
                                        </div>
                                    </div>
                                </Card.Description>
                                <br></br>
                                <EditProject Proj = {project} usersAll = {users} projectId = {project.id} refreshProjectList = {emptyTheEdit}/>
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
        </div>
    );
     
}

export default Project;