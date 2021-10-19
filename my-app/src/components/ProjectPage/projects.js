import React from 'react';
import './temp.css';
import { Card, Grid, Accordion, Icon } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import AddProject from './addProject'
import EditProject from './editProject'
import AddList from '../Lists/addList';
import Member from './member2';
import DeletePopUp from '../extra/deletePopup';

const Project = (props) => {
    const [projects, setProjects] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const curUser = props.curUser
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

    // function handleDeleteEvent(id) {
    //     axios
    //         .delete("http://localhost:3000/keepTrack/project/"+ id +"/", {
    //             headers: {"X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
    //             params: {withCredentials : true}
    //         })
    //         .then((response)=>{
    //             console.log(response);
    //             fetchProjectList();
    //         })
    //         .catch((err) => {
    //             console.log("hemlo")
    //             console.log(err);
    //         });
    // };

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
        label : user.name,
        text : user.name
    }))
    
    function getMembers(members_p){
        let memberList = []
        members_p.map(user =>{
            users.map(item=>{
                if(item.id==user){
                    memberList.push(item.name)
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
    
    const handleClickDesc = (e,titleProps) =>{
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index
        setActiveIndex(newIndex);
    }

    const createMarkup = (content) => {
        return {__html: content};
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
                <Grid  columns={2} className='projectBox2'>
                {projects.map(function(project, index){
                    return(
                        <div key={project.id} className='project-cards'>
                            <Card className={(project.is_completed)?'card-green-p':'card-red-p'} >
                            <Card.Content>
                                <AddList page={2} id={project.id} project_name={project.project_name}/>
                                <div className='card-header'><NavLink to={"/project/"+project.id+"/lists"}>{project.project_name}</NavLink></div>
                                <br></br>
                                <div className='card-content-extra'><strong>Created by: </strong>{getCreator(project.creator)}</div>
                                <Accordion>
                                    <Accordion.Title
                                        active = {activeIndex==project.id}
                                        index = {project.id}
                                        onClick={handleClickDesc}
                                        className='desc-accordion'
                                    >
                                         <Icon name='dropdown' />
                                       <strong>Description:</strong> 
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === project.id}>
                                        <Card.Description className='desc-accordion' dangerouslySetInnerHTML={createMarkup(project.wiki)}>
                                        {/* {project.wiki} */}
                                        </Card.Description>
                                    </Accordion.Content>
                                </Accordion>
                                
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
                                <EditProject page={1} Proj = {project} usersAll = {users} projectId = {project.id} refreshProjectList = {emptyTheEdit}/>
                                {/* <Button className='edit-delete' floated='right'basic color='red' onClick={() => handleDeleteEvent(project.id)}>
                                    <Icon name='dont' />Delete
                                </Button> */}
                                <DeletePopUp type ='project' id = {project.id} refreshProjectList = {emptyTheEdit}/>
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