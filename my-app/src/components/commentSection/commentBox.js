import React from 'react';
import { Card, Grid, Accordion, Popup, Modal, Comment, Button, Form, Loader, Icon } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import './temp6.css'
import Member from '../ProjectPage/member2';
import moment from 'moment'

const CommentBox = (props) => {
    const type = props.type;
    const id = props.id;
    const user = props.user;
    const name = props.name;
    const [prevComments, setPrevComments] = React.useState([]);
    const [curComment, setCurComment] = React.useState('');
    const [socket, setSocket] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(-1);
    const [deleteCommentContent,setDeleteComment] = React.useState('');
    const [editComment,setEditComment] = React.useState('');
    const [editOpen, setEditOpen] = React.useState(false);
    const [editId, setEditId] = React.useState(-1);
    
    const setCurComment1 = (v) =>{
        setCurComment(v);
        if(v===''&&editComment!=''){
            setEditComment('');
            setEditId(-1);
        }
    }
    
    const establishConnection = () => {
        const chatSocket = new WebSocket('ws://127.0.0.1:8000/ws/comments/'+type+'_'+id + '/');
        setSocket(chatSocket)
        chatSocket.onopen = () => {
            console.log("Websocket Connection established");
        };
        fetchPrevComments()
    }

    function fetchPrevComments() {
        axios
            .get('http://localhost:3000/keepTrack/card/'+id+'/comments', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setPrevComments(response.data)
                setScroll_Bottom()
            })
            .catch((error) => console.log(error));
    } 

    function setScroll_Bottom() {
        var objDiv = document.getElementById("comment-box-comments");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    
    const disconnectSocket = () => {
        socket.close();
        socket.onclose = () => {
            console.log("Server disconnected");
        };
    }
 
    if(open===true){
        socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if(data['info']==='comment'){
                var extra = prevComments;
                extra.push(data['message']);
                setPrevComments([...extra]);
                setScroll_Bottom();
            }
            if(data['info']==='delete'){
                for(let i = 0 ; i < prevComments.length ; i++){
                    if(prevComments[i].id===data['comment']['id']){
                        prevComments.splice(i, 1);
                        var extra = prevComments;
                        setPrevComments([...extra]);
                    }
                }
            }
            if(data['info']==='edit'){
                for(let i = 0 ; i < prevComments.length ; i++){
                    if(prevComments[i].id===data['comment']['id']){
                        prevComments.splice(i, 1);
                        var extra = prevComments;
                        extra.push(data['comment']);
                        console.log(data['comment'])
                        setPrevComments([...extra]);
                    }
                }
            }
        };
    }

    const sendComment = () => {
        if(curComment===''){
            return;
        }
        if(editComment!=''){
            setEditOpen(true);
            return;
        }
        const data = {
            message : {
                comment_content : curComment,
                sender : user.id,
                time : new Date(),
                card : id,
            }   
        };
        socket.send(JSON.stringify(data));
        setCurComment('')
    }

    const editCommentAction = () =>{
        const data = {
            comment_content : curComment,
            time : new Date(),
        }
        axios
            .patch("http://localhost:3000/keepTrack/comments_c/"+editId+"/",data, {
                headers: { 'Content-Type': 'application/json', "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                // console.log(response);
                setEditId(-1);
                setCurComment('');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const deleteComment = (id) =>{
        if(editId===id){
            setEditId(-1);
            setEditComment('')
            setCurComment('')
        }
        axios
            .delete("http://localhost:3000/keepTrack/comments_c/"+ id +"/", {
                headers: {"X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // const editComment = (id) =>{
    //     data = {
    //         comment_content = curComment
    //     }
    //     axios
    //         .patch("http://localhost:3000/keepTrack/comments_c/"+ id +"/",data, {
    //             headers: { 'Content-Type': 'application/json', "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
    //             params: {withCredentials : true}
    //         })
    //         .then((response)=>{
    //             console.log(response);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }

    return(
        <Modal
                className='card-popup-modal-comments'
                onClose={() => {setOpen(false);disconnectSocket()}}
                onOpen={() => {setOpen(true);establishConnection()}}
                open={open}
                trigger={<Button icon='comments' floated='right' color='blue' size='large' ></Button>}
        >
        <Modal.Header>Card_{name}</Modal.Header>
            <Modal 
                className='card-popup-modal-comments-delete'
                open = {editOpen}
            >
               <Modal.Content>Are you sure you want to edit the comment<br></br>
                "{editComment}" <br></br> to <br></br> "{curComment}"
               </Modal.Content>
                <Button floated='right' color='red' onClick={() => {editCommentAction();setEditOpen(false);setEditComment('')}}>
                    Edit
                </Button>
                <Button floated='left' color='teal' onClick={() => {setEditOpen(false);setEditComment('');setEditId(-1);setCurComment('')}}>
                    Cancel
                </Button> 
            </Modal>
            <Modal 
                className='card-popup-modal-comments-delete'
                open = {openDelete>-1}
            >
               <Modal.Content>Are you sure you want to delete this comment?<br></br>
                "{deleteCommentContent}"
               </Modal.Content>
                <Button floated='right' color='red' onClick={() => {deleteComment(openDelete);setOpenDelete(-1);setDeleteComment('')}}>
                    Delete
                </Button>
                <Button floated='left' color='teal' onClick={() => {setOpenDelete(-1);setDeleteComment('')}}>
                    Cancel
                </Button> 
            </Modal>
        <Modal.Content className='comment-box-comments' id='comment-box-comments'>
            {   
                (prevComments==='')?(<Loader/>):(
                prevComments.map(function(comment,index){
                    return(
                        <Comment key={index} className={(comment.sender.id===user.id)?('flex-div-comment-right'):('flex-div-comment-left')}>
                        <Member key = {comment.sender.id} user = {comment.sender} />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {/* <Comment.Avatar size='small' as='a' src={comment.sender.profilePic} /> */}
                        <Comment.Content className='comment-content'>
                            <div className='flex-div-2-comment'>
                                <div className='flex-div-2-comment-2'>
                                <Comment.Author as='a'>{comment.sender.name}</Comment.Author>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Comment.Metadata className='time-comment'>{moment(comment.time).fromNow()}</Comment.Metadata>
                                </div>
                                {(comment.sender.id===user.id)?(<div className='icon-comment-del'><Icon name='pencil alternate' onClick={()=>{setCurComment(comment.comment_content);setEditComment(comment.comment_content);setEditId(comment.id)}} color='yellow' floated='right'></Icon></div>):('')}
                                {(comment.sender.id===user.id)?(<div className='icon-comment-del'><Icon name='trash alternate' onClick={()=>{setOpenDelete(comment.id);setDeleteComment(comment.comment_content)}} color='red' floated='right'></Icon></div>):('')}
                                </div>
                            <Comment.Text>{comment.comment_content}</Comment.Text>
                        </Comment.Content>
                        
                        </Comment>
                )}))
            }
        </Modal.Content>
        <Popup 
            content='Go to bottom of comment section' 
            trigger={
                <Button className='button-bottom' color='blue' floated='right' onClick={()=>setScroll_Bottom()} icon='arrow down'></Button>
            } 
        />
        <Modal.Content>
        <Form reply>
            <Form.TextArea 
                value = {curComment}
                onChange={ (e) => {setCurComment1(e.target.value);}}
            />
                <Button content='Add Comment' size='small' id='button-comment-send' onClick={sendComment} labelPosition='left' icon='edit' primary />
            </Form>
        </Modal.Content>
        </Modal>
    )


}

export default CommentBox;