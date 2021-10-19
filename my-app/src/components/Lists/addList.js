import React from 'react';
import './temp1.css';
import { Form, Checkbox, Button, Icon } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import Popup from 'reactjs-popup';

const AddList = (props) => {
    const [listInfo, setListInfo] = React.useState({
        list_name: "",
    });
    
    const [is_completed, setis_completed] = React.useState(false);
    const project_id = props.id;
    const project_name = props.project_name

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
            project_l : project_id
        };
        if(listInfo.list_name===''){
            alert('Please enter list name!!')
            return
        }
        setListInfo((prevValue)=>({
            ...prevValue,
            list_name:'',
        }));
        setis_completed(false)

        axios
            .post("http://localhost:3000/keepTrack/list/",data, {
                headers: { 'Content-Type': 'application/json', "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                props.refreshProjectList(true);
            })
            .catch((err) => {
                // alert('Please enter a unique list name!!')
                console.log(err);
            });
    }

    return(
        <div>
        <Popup
            trigger={(props.page===1)?(<button className="addlist">
                                        <Icon name='add square' size='big'/> <br></br>
                                        Add List
                                        </button>):(<Button
                                color='teal'
                                circular
                                floated='right'
                                size='mini'
                                >  Add List</Button>)}
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
                        onChange={handleStatusChange}/>
                        Complete?
                    </div>
                    <br></br>
                    <Form.Input 
                        placeholder='Project Name' 
                        width={16}
                        name='project_name'
                        value={project_name}
                    />
                    <br></br>
                    <div className='flex-div'>
                    <Button 
                        color='teal'
                        type='button'
                        onClick={() => {
                        handleFormSubmit()
                        close();
                        }}>Add List</Button>
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

export default AddList;