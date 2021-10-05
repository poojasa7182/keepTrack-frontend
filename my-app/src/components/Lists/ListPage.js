import React from 'react'
import List from './lists'
import SidebarMenu from '../SideBar/menu'
import './temp1.css';

const ListPage = () => (
    <div>
        <div className='container'>
            <div className='sidebar'>
                <SidebarMenu />
            </div>
            <div className='listsContainer'>
                <List />
            </div>
        </div>
        <div className='footer'>
            Footer
        </div>
    </div>
    
  
)

export default ListPage