import React, {useRef} from 'react';
import Select from 'react-select'
import './temp3.css';
import { Form, Checkbox, Button, TextArea, Icon, Card } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import axios from "axios";
import JoditEditor from "jodit-react";
import dateFormat from 'dateformat';
import Datetime from 'react-datetime';
import Cookies, { set } from 'js-cookie';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { MultiSelect } from "react-multi-select-component";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

const EditCard = (props) => {
    
    var curCard = props.card
    var start_date1 = new Date(curCard.start_date)
    var due_date1 = new Date(curCard.due_date)
    const [cardInfo, setCardInfo] = React.useState({
        card_name: curCard.card_name,
    });
    const [is_completed, setis_completed] = React.useState(curCard.is_completed);
    const [start_date, setStart_date] = React.useState(curCard.start_date);
    const [due_date, setDue_date] = React.useState(curCard.due_date);
    const [members_c, setMembers_c] = React.useState(curCard.members_c);
    const [description, setDescription] = React.useState(curCard.description);
    
    const handleInfoChange = (e) => {
        const {name,value} = e.target;
        setCardInfo((prevValue)=>({
            ...prevValue,
            [name]:value,
        }));
    };

    const handleStatusChange = (event, data) => {
        console.log(start_date)
        setis_completed(!is_completed);
    }

    const handleSDateChange = (event, data) =>{ 
        var temp = data.value.toISOString()
        var isoDateTime = new Date(temp)
        var localDateTime = isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
        var toSet = localDateTime.slice(6,10) + '-' + localDateTime.slice(3,5)+ '-' + localDateTime.slice(0,2);
        setStart_date(toSet);
        start_date1 = new Date(start_date)
    }
    const handleDDateChange = (event, data) =>{ 
        var temp = data.value.toISOString()
        var isoDateTime = new Date(temp)
        var localDateTime = isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
        var toSet = localDateTime.slice(6,10) + '-' + localDateTime.slice(3,5)+ '-' + localDateTime.slice(0,2);
        setDue_date(toSet);
        due_date1 = new Date(due_date)
    }

    var handleMembersChange = (e) => {
        var temp = [];
        for(var i = 0 ; i < e.length ; i++) temp.push(e[i].key)
        setMembers_c(temp)
        cardMem = e;
    }

    React.useEffect(()=>{
        
    }, []);

    const members = props.users.map((user)=>({
        key : user.id,
        value : user.id,
        label : user.username,
        text : user.username,
    }))

    var cardMem = members.filter(mem => members_c.indexOf(mem.key)>-1);

    const handleFormSubmit = () => {
        const data = {
            card_name : cardInfo.card_name,
            start_date : start_date,
            due_date : due_date,
            description: description,
            is_completed : is_completed,
            members_c : members_c,
            project_c : curCard.project_c.id,
            list_c : curCard.list_c.id
        };
        console.log(data)
        axios
            .put("http://localhost:3000/keepTrack/card/"+curCard.id+'/',data, {
                headers: { 'Content-Type': 'application/json', "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
                props.refreshProjectList(true);
            })
            .catch((err) => {
                console.log("hemlo")
                console.log(err);
            });
    }

    return(
        <div>
        <Popup
            trigger={(props.page===1)?(<Button className='edit-delete-c' floated='left' basic color='yellow'>
            <Icon name='edit'/> Edit
        </Button>) :(<Button floated='right' icon='edit' circular size='mini' color='yellow'></Button> )}
            modal
            className="temp"
            nested>
                
{close => (
            <div className="editCardPopUp"> 
                <Form className='form-popup-c'>
                    <Form.Input 
                        placeholder='Card title' 
                        width={16}
                        name='card_name'
                        value={cardInfo.card_name}
                        onChange={handleInfoChange} />

                    <Form.Group widths='equal'>
                        <SemanticDatepicker value={start_date1} label='Start-date' onChange={handleSDateChange} />
                        <SemanticDatepicker value={due_date1} label='Due-date' onChange={handleDDateChange} />
                    </Form.Group>

                    <TextArea 
                    placeholder='Description' 
                    style={{ minHeight: 100 }}
                    value = {description}
                    onChange= {newWiki => setDescription(newWiki.target.value)}
                    />
                    <br></br>
                    <br></br>
                    <Form.Field
                    control={Checkbox}
                    width={1}
                    label='Complete?'
                    onChange={handleStatusChange}
                    />
                    <MultiSelect
                        options={members}
                        value={cardMem}
                        onChange={handleMembersChange}
                        labelledBy="Assignees"
                    />
                    <br></br>
                    <Form.Input 
                        placeholder='Project Name' 
                        width={16}
                        name='project_name'
                        value={props.project_name}
                    />
                    <Form.Input 
                        placeholder='List Name' 
                        width={16}
                        name='list_name'
                        value={props.list_name}
                    />
                    <div className='flex-div'>
                    <Button 
                        color='teal'
                        type='button'
                        onClick={() => {
                        handleFormSubmit()
                        close();
                        }}>Update Card</Button>
                    </div>
                </Form>
                <button onClick={close} className="button-close-c">
                <Icon name='close' color='red' size='big'/>
                </button>
            </div>
            )}
        </Popup>
        </div>
    );
}

export default EditCard;