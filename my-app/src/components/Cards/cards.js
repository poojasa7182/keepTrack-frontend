import React from 'react';
import './temp3.css';
import { Card, Grid, Loader } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import AddCard from './addcards'
import EditCard from './editcards';
import DeletePopUp from '../extra/deletePopup'
// import AddProject from './addProject'
// import EditProject from './editProject'
// import AddList from '../Lists/addList';
import Member from '../ProjectPage/member2'
import CommentBox from '../commentSection/commentBox';

const ListCard = (props) => {
    const params = useParams();
    const listId = params.listId
    const projectId = params.projectId
    const curUser = props.user
    const [curProject, setCurProject] = React.useState('');
    const [curList, setCurList] = React.useState('');
    const [cards, setCards] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [lists, setLists] = React.useState([]);

    async function fetchUserList() {
        await axios
            .get('http://localhost:3000/keepTrack/user/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setUsers(response.data)
                fetchProjectDetails();
            })
            .catch((error) => console.log(error));
    }
    
    function fetchProjectDetails() {
        axios
            .get('http://localhost:3000/keepTrack/project/'+projectId+'/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setCurProject(response.data)
                fetchListDetails()
                // fetchListsOfproject();
            })
            .catch((error) => console.log(error));
    }

    function fetchListDetails(){
        axios
            .get('http://localhost:3000/keepTrack/list/'+listId+'/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setCurList(response.data)
            })
            .catch((error) => console.log(error));
    }

    function fetchCardsOfLists() {
        axios
            .get('http://localhost:3000/keepTrack/list/'+listId+'/cards', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setCards(response.data)
            })
            .catch((error) => console.log(error));
    } 

    function fetchListsOfproject() {
        axios
            .get('http://localhost:3000/keepTrack/project/'+projectId+'/list', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                fetchUserList();
                // console.log(response.data.list_name)
                let user_list=[];
                // console.log("hi")
                const users=response.data;
                
                for(let u in users){
                    let dict = {};
                    dict["key"] = users[u]["id"];
                    dict["value"] = users[u]["id"];
                    // dict["label"] = users[u]["list_name"];
                    dict["text"] = users[u]["list_name"];

                    user_list.push(dict);
                }
                setLists(user_list)
            })
            .catch((error) => console.log(error));
    }


    React.useEffect(()=>{
        fetchListsOfproject();
        fetchCardsOfLists();
    }, []);

    function callFetchFunction (a) {
        if(a===true){
            a = false;
            fetchCardsOfLists();
        }
    }
    // function callFetchFunction (a) {
    //     if(a===true){
    //         a = false;
    //         fetchProjectList();
    //     }
    // }

    // function callFetchFunction2 (a){
    //     return
    // }

    // function emptyTheEdit (a) {
    //     if(a===true){
    //         a = false;
    //         fetchProjectList();
    //     }
    // }

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

    return(
        <div className='container-card'>
            <div className='header-c'>
                <div className='heading-c'>
                    <h1 className='heading-c'>
                        {
                            (curProject===''||curList==='')?(<Loader/>):(<div><NavLink to={"/project/"+curProject.id+"/lists/"}>{curProject.project_name}</NavLink> : {curList.list_name}</div>)
                        }
                    </h1>
                </div>
                <div className='addCard'>
                        <div >
                        <AddCard page={1} users={users} refreshProjectList = {callFetchFunction} projectId={curProject.id} listId={curList.id} project_name={curProject.project_name} list_name={curList.list_name} />
                        </div>
                </div>
            </div>
            <div className="cardBox">
                <Grid className="cardBox2" container columns={3}>
                {cards.map(function(card, index){
                    return(
                        <div key={card.id} className='card-cards'>
                            <Card className={(card.is_completed)?'card-green-c':'card-red-c'} >
                            <Card.Content>
                                <CommentBox type='card' id = {card.id} user={props.user} name={card.card_name} />
                                <div className='card-header-c'>{card.card_name}</div>
                                <br></br>
                                <Card.Description>
                                    {card.description}
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='card-content-extra-c'>
                                <Card.Description>
                                    <strong>Start Date:</strong>{card.start_date}
                                    <br></br>
                                    <strong>Due Date:</strong>{card.due_date}
                                </Card.Description>
                                </div>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='card-content-extra-c'>
                                <Card.Description>
                                    <strong>Assigned to: </strong>
                                    <div className='flex-div-2'>
                                        {
                                            card.members_c.map(function(user,index){
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
                                            })
                                        }
                                    </div>
                                </Card.Description>
                                <br></br>
                                <EditCard page={1} card = {card} lists={lists} users = {users} project_name={curProject.project_name} list_name={curList.list_name} refreshProjectList = {callFetchFunction}/>
                                {/* <Button className='edit-delete-c' floated='right'basic color='red' onClick={() => handleDeleteEvent(card.id)}>
                                    <Icon name='dont' />Delete
                                </Button>  */}
                                <DeletePopUp type='card' id = {card.id} refreshProjectList = {callFetchFunction}/>
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

export default ListCard;