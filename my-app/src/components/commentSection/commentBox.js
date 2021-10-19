import React from 'react';
import { Card, Grid, Accordion, Popup, Modal, Comment, Button, Form, Loader } from 'semantic-ui-react';
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
    var data = 'abc';

    
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
            var extra = prevComments;
            extra.push(data['message']);
            setPrevComments([...extra])
            setScroll_Bottom()
        };
    }

    const sendComment = () => {
        if(curComment===''){
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

    return(
        <Modal
                className='card-popup-modal-comments'
                onClose={() => {setOpen(false);disconnectSocket()}}
                onOpen={() => {setOpen(true);establishConnection()}}
                open={open}
                trigger={<Button icon='comments' floated='right' color='blue' size='large' ></Button>}
        >
        <Modal.Header>Card_{name}</Modal.Header>
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
                            <div className='flex-div-2'>
                                <Comment.Author as='a'>{comment.sender.name}</Comment.Author>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Comment.Metadata className='time-comment'>{moment(comment.time).fromNow()}</Comment.Metadata>
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
                onChange={ (e) => setCurComment(e.target.value)}
            />
                <Button content='Add Comment' size='small' id='button-comment-send' onClick={sendComment} labelPosition='left' icon='edit' primary />
            </Form>
        </Modal.Content>
        </Modal>
    )


}

export default CommentBox;