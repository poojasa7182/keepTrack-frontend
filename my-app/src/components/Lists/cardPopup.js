import React, {useRef} from 'react';
import { Form, Checkbox, Button, TextArea, Card, Icon, Menu, Sidebar, Grid, Loader, Modal, Item } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { Redirect, NavLink } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Member from '../ProjectPage/member2';
import EditCard from '../Cards/editcards';

const CardPopup = (props) => {
    const card = props.card
    const users = props.users
    const [open, setOpen] = React.useState(false)
    
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
    
    const callFetchFunction=()=>{
        return
    }
    // const card_mem = card.members_c.map(user =>{
    //     users.map(item=>{
    //         if(item.id==user){
    //            username:item.name
    //         }
    //     })
    // })
    return(
        <div>
            <Modal
                className='card-popup-modal'
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={<Button className='card-popup-button'>{card.card_name}</Button>}
            >
                <Modal.Header>{card.card_name}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        {card.description}
                    </Modal.Description>
                    <br></br>
                    <strong>Start Date : </strong>{card.start_date}
                    <br></br>
                    <strong>Due Date : </strong>{card.due_date}
                    <br></br>
                    <strong>Assigned to :</strong>
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
                </Modal.Content>
                <Button floated='right' color='teal' onClick={() => setOpen(false)}>
                    Close
                </Button>
            </Modal>
        </div>
    )
}

export default CardPopup;