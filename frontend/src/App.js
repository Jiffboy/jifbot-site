import React from 'react'
import Navbar from './common/navbar'
import HomePage from './home/homePage'
import CommandsPage from './commands/commandsPage'
import ChangelogPage from './changelog/changelogPage'
import SetupPage from './setup/setupPage'
import TitleLogo from './common/titleLogo'
import { Route, Routes } from "react-router-dom"

function App() {
	return (
		<div>
            <TitleLogo/>
		    <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/commands" element={<CommandsPage/>}/>
                <Route path="/changelog" element={<ChangelogPage/>}/>
                <Route path="/setup" element={<SetupPage/>}/>
            </Routes>
		</div>
	)
}

export default App