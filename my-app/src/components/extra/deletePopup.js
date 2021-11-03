import React from 'react';
import { Button, Icon, Modal} from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from "react-router-dom";

const DeletePopUp = (props) => {
    const [open, setOpen] = React.useState(false)
    var type = props.type
    let history = useHistory();

    function handleDeleteEvent(id) {
        axios
            .delete("http://localhost:3000/keepTrack/"+type+"/"+ id +"/", {
                headers: {"X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
                props.refreshProjectList(true)
                setOpen(false)
                if(props.type==='project'){
                    history.replace("/project")
                }
            })
            .catch((err) => {
                setOpen(false)
                alert("You dont have permissions to delete this" )
                console.log("hemlo")
                console.log(err);
            });
    };

    return(
        <div>
            <Modal
                className='card-popup-modal'
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={(props.page===1)?(<button className="addlist2">
                                        <Icon name='dont' size='big'/> <br></br>
                                        Delete
                                        </button>):(<Button className='edit-delete' floated='right' basic color='red' >
                <Icon name='dont'/>Delete
            </Button>)}
            >
                <Modal.Header>Are you sure you want to delete this {props.type}?</Modal.Header>
                <Button floated='right' color='red' onClick={() => {handleDeleteEvent(props.id);}}>
                    Delete
                </Button>
                <Button floated='left' color='teal' onClick={() => setOpen(false)}>
                    Cancel
                </Button>
            </Modal>
        </div>
    )
}

export default DeletePopUp;