import React from 'react'
import ListCard from './cards'
import SidebarMenu from '../SideBar/menu'
import './temp3.css';

const CardPage = () => (
    <div>
        <div className='container-c'>
            <div className='sidebar'>
                <SidebarMenu />
            </div>
            <div className='cardsContainer'>
                <ListCard />
            </div>
        </div>
        <div className='footer'>
            Footer
        </div>
    </div>
    
  
)

export default CardPage