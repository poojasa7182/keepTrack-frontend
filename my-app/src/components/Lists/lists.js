import React from 'react';
import { Loader, Card, Grid, Button } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { useParams, NavLink } from 'react-router-dom';
import './temp1.css';
import AddList from './addList';
import EditList from './editList';
import AddCard from '../Cards/addcards'
import CardPopup from './cardPopup';
import DeletePopUp from '../extra/deletePopup'
import EditProject from '../ProjectPage/editProject';

const Lists = (props) => {
    const params = useParams();
    const projectId = params.projectId
    const [projects, setProjects] = React.useState([]);
    const [curProject, setCurProject] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const [lists, setLists] = React.useState([]);
    const [list_name, setlistname] = React.useState('');
    const curUser = props.curUser;
    const [curList, setCurList] = React.useState(-1);
    // var isMember = (curProject.members)
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
                // console.log(response.data)
                // fetchListsOfproject();
            })
            .catch((error) => console.log(error));
    }

    function fetchListsOfproject() {
        axios
            .get('http://localhost:3000/keepTrack/project/'+projectId+'/list', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                // console.log(response.data.list_name)
                setLists(response.data)
                setlistname(response.data.list_name)
            })
            .catch((error) => console.log(error));
    }

    async function changeListName(id,listname){
        const data = {
            list_name : list_name
        };
        if(list_name===listname){
            return
        }
        axios
            .patch("http://localhost:3000/keepTrack/list/"+id+"/",data, {
                headers: { 'Content-Type': 'application/json', "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                // console.log(response);
                fetchListsOfproject()
            })
            .catch((err) => {
                console.log("hemlo")
                console.log(err);
            });
    }

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

    function emptyTheEdit (a) {
        if(a===true){
            a = false;
            fetchProjectDetails()
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
                        <div className='flex-div-2'>
                            <EditProject page={2} Proj = {curProject} usersAll = {users} projectId = {curProject.id} refreshProjectList = {emptyTheEdit}/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <DeletePopUp page={1} type ='project' id = {curProject.id} refreshProjectList = {emptyTheEdit}/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                            <Button as={NavLink} to={"/project/"+curProject.id+"/list/"+list.id+"/cards"}
                            color='orange' circular floated='left' size='mini' >View All Cards</Button>
                            <AddCard page={2} users={users} refreshProjectList = {callFetchFunction} projectId={curProject.id} listId={list.id} project_name={curProject.project_name} list_name={list.list_name} />
                                {/* <div className='card-header'><NavLink to={"/project/"+curProject.id+"/list/"+list.id+"/cards"}>{list.list_name}</NavLink></div> */}
                                {/* {list.list_name} */}
                                <div><input value={(curList===list.id)?list_name:list.list_name} className='input-dynamic card-header' type='text' onChange={(e)=>setlistname(e.target.value)} onBlur={()=>{changeListName(list.id,list.list_name);setCurList(-1)}} onFocus={()=>{setCurList(list.id);setlistname(list.list_name)}}/>
                                </div>
                                <br></br> 
                            </Card.Content>
                            {list.cardsOfList.map(function(card){
                                return(
                                    <div key={card.id} draggable className='card-cards-l'>
                                        <CardPopup lists={lists} curList={list} card = {card} users={users}/>
                                    </div>
                            )})}
                            <Card.Content extra>
                                <div className='card-content-extra'>
                                    <EditList refreshProjectList = {callFetchFunction} listDetails = {list} project_name = {curProject.project_name}/>
                                    <DeletePopUp type='list' id = {list.id} refreshProjectList = {callFetchFunction}/>
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