import React from 'react'
import Navbar from './common/navbar'
import HomePage from './home/homePage'
import CommandsPage from './commands/commandsPage'
import ChangelogPage from './changelog/changelogPage'
import StatsPage from './stats/statsPage'
import PrivacyPolicyPage from './privacypolicy/privacyPolicyPage'
import TermsOfServicePage from './tos/termsOfServicePage'
import BlorbopediaPage from './blorbopedia/blorbopediaPage'
import EditPage from './blorbopedia/editPage'
import TitleLogo from './common/titleLogo'
import Footer from './common/footer'
import BlorboPage from './blorbopedia/blorboPage'
import { Route, Routes } from "react-router-dom"
import './App.css'

function App() {
	return (
		<div className="body">
            <TitleLogo/>
		    <Navbar/>
		    <div className="page-content">
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/commands" element={<CommandsPage/>}/>
                    <Route path="/changelog" element={<ChangelogPage/>}/>
                    <Route path="/stats" element={<StatsPage/>}/>
                    <Route path="/tos" element={<TermsOfServicePage/>}/>
                    <Route path="/privacy" element={<PrivacyPolicyPage/>}/>
                    <Route path="/blorbopedia" element={<BlorbopediaPage/>}/>
                    <Route path="/blorbopedia/edit" element={<EditPage/>}/>
                    <Route path="/blorbopedia/:name" element={<BlorboPage/>}/>
                </Routes>
            </div>
            <Footer/>
		</div>
	)
}

export default App