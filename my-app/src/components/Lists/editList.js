import React, {useRef} from 'react';
import './temp1.css';
import { Form, Checkbox, Button, TextArea, Icon } from 'semantic-ui-react';
import axios from "axios";
import Cookies, { set } from 'js-cookie';
import Popup from 'reactjs-popup';

const EditList = (props) => {
    const list = props.listDetails

    const [listInfo, setListInfo] = React.useState({
        list_name: list.list_name,
    });

    const [is_completed, setis_completed] = React.useState(list.is_completed);
    
    const handleInfoChange = (e) => {
        const {name,value} = e.target;
        setListInfo((prevValue)=>({
            ...prevValue,
            [name]:value,
        }));
    };

    const handleStatusChange = (event, data) => {
        setis_completed(!is_completed);
    }
    
    const handleFormSubmit = () => {

        const data = {
            list_name : listInfo.list_name,
            is_completed : is_completed,
            project_l : list.project_l
        };

        axios
            .put("http://localhost:3000/keepTrack/list/"+list.id+"/",data, {
                headers: { 'Content-Type': 'application/json', "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                props.refreshProjectList(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return(
        <div>
        <Popup
            trigger={<Button className='edit-delete' floated='left' color='yellow' basic >
            <Icon name='edit' /> Edit
        </Button>}
            modal
            className="temp"
            nested
            closeOnDocumentClick
        >
            {close => (
            <div className="addListPopUp"> 
                <Form className='form-popup'>
                    <Form.Input 
                        placeholder='List Name' 
                        width={16}
                        name='list_name'
                        value={listInfo.list_name}
                        onChange={handleInfoChange} />
                    
                    <div className='flex-div-2'>
                        <Form.Field
                        control={Checkbox}
                        width={1}
                        checked = {is_completed}
                        onChange={handleStatusChange}/>
                        Complete?
                    </div>
                    <br></br>
                    <Form.Input 
                        placeholder='Project Name' 
                        width={16}
                        name='project_name'
                        value={props.project_name}
                    />
                    <br></br>
                    <div className='flex-div'>
                    <Button 
                        color='teal'
                        type='button'
                        onClick={() => {
                        handleFormSubmit()
                        close();
                        }}>Update List</Button>
                    </div>
                </Form>
                <button onClick={close} className="button-close">
                <Icon name='close' color='red' size='big'/>
                </button>
            </div>
            )}
        </Popup> 
        </div>
    );
}

export default EditList;