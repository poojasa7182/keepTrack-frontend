import React from 'react'
import UserInfo from './Info'
import SidebarMenu from '../SideBar/menu'
import './temp4.css';

const DashBoardPage = () => (
    <div>
        <div className='container'>
            <div className='sidebar'>
                <SidebarMenu />
            </div>
            <div className='listsContainer'>
                <UserInfo />
            </div>
        </div>
        <div className='footer'>
            Footer
        </div>
    </div>
    
  
)

export default DashBoardPage