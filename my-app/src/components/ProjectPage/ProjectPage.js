import React from 'react'
import Project from './projects'
import SidebarMenu from '../SideBar/menu'
import './temp.css';

const ProjectPage = () => (
    <div>
        <div className='container'>
            <div className='sidebar'>
                <SidebarMenu />
            </div>
            <div className='projectsContainer'>
                <Project />
            </div>
        </div>
        <div className='footer'>
            Footer
        </div>
    </div>
    
  
)

export default ProjectPage