import React from 'react';
import './temp3.css';
import { Form, Checkbox, Button, TextArea, Icon, Modal, Dropdown } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
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
    const [open, setOpen] = React.useState(false);
    const [messageNo, setNum] = React.useState(-1);
    const [lists, setLists] = React.useState(props.lists);
    const [list, setList] = React.useState(curCard.list_c.id);

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
        if(data.value===null){
            setStart_date('')
            return
        } 
        var temp = data.value.toISOString()
        var isoDateTime = new Date(temp)
        var localDateTime = isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
        var toSet = localDateTime.slice(6,10) + '-' + localDateTime.slice(3,5)+ '-' + localDateTime.slice(0,2);
        setStart_date(toSet);
        start_date1 = new Date(start_date)
    }
    const handleDDateChange = (event, data) =>{ 
        if(data.value===null){
            setDue_date('')
            return
        }
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

    const setAllFields = () =>{
        setCardInfo((prevValue)=>({
            ...prevValue,
            card_name : curCard.card_name,
        }));
        setis_completed(curCard.is_completed)
        setStart_date(curCard.start_date)
        setDue_date(curCard.due_date)
        setMembers_c(curCard.members_c)
        setDescription(curCard.description)
    }

    React.useEffect(()=>{
        setLists(props.lists)
    }, []);
      
    const members = props.users.map((user)=>({
        key : user.id,
        value : user.id,
        label : user.name,
        text : user.name,
    }))

    var cardMem = members.filter(mem => members_c.indexOf(mem.key)>-1);

    const handleFormSubmit = () => {

        if(cardInfo.card_name===''||start_date===''||due_date===''||description===''){
            setNum(1);
            setOpen(true)
            return;
        }

        const data = {
            card_name : cardInfo.card_name,
            start_date : start_date,
            due_date : due_date,
            description: description,
            is_completed : is_completed,
            members_c : members_c,
            project_c : curCard.project_c.id,
            list_c : list
        };

        var date1 = new Date(start_date)
        var date2 = new Date(due_date)

        if(date1-date2>0){
            setNum(2)
            setOpen(true)
            return
        }

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
                setNum(3);
                setOpen(true)
                console.log("hemlo")
                console.log(err);
            });
    }

    const handleListChange = (event,data) => {
        setList(data.value)
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
                <Modal
                     onClose={() => setOpen(false)}
                     onOpen={() => setOpen(true)}
                     open={open}
                >
                    <Modal.Content>
                        {
                            (messageNo===2)?('Due date cannot be smaller than start date of project!')
                            :((messageNo===1)?('Please fill all the fields'):('Please enter a unique card name'))
                        }
                        
                    </Modal.Content>
                    <Button color='black' onClick={() => setOpen(false)}>
                        Ok
                    </Button>
                </Modal>
                <Form className='form-popup-c'>
                    <Form.Input 
                        placeholder='Card title' 
                        width={16}
                        name='card_name'
                        value={cardInfo.card_name}
                        onChange={handleInfoChange} />

                    <Form.Group widths={2}>
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
                    <Dropdown
                        placeholder='Select List'
                        fluid
                        selection
                        // loading={true}
                        // loading={(props.lists===[])?(true):(false)}
                        value = {list}
                        options={lists}
                        onChange={(event,data)=> handleListChange(event,data)}
                    />
                    <br></br>
                    <Form.Input 
                        placeholder='Project Name' 
                        width={16}
                        name='project_name'
                        value={props.project_name}
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
                <button onClick={() =>{close();setAllFields()}} className="button-close-c">
                <Icon name='close' color='red' size='big'/>
                </button>
            </div>
            )}
        </Popup>
        </div>
    );
}

export default EditCard;