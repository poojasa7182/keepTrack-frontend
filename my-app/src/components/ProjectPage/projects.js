import React, {useRef} from 'react';
import Select from 'react-select'
import './temp.css';
import { Form, Checkbox, Button, TextArea } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import axios from "axios";
import JoditEditor from "jodit-react";
import dateFormat from 'dateformat';
import Datetime from 'react-datetime';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';
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
 
        <div>
            <div className="projectBox">
                {projects.map(function(project, index){
                    return(
                        <div key={project.id}>
                            {project.id},
                            {project.project_name}
                            &nbsp;&nbsp;
                            <button type="button" onClick={() => handleDeleteEvent(project.id)}>Delete</button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button type="button"  onClick={() => handleEditEvent(project.id)}>Edit</button> 
                        </div>
                    )
                })}
            </div>
            <AddProject 
                refreshProjectList = {callFetchFunction}     
            />
            {editList}
        </div>
    );
     
}

export default Project;