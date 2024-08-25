import React from 'react'
import '../common/css/textPageContainer.css'
import './css/privacyPolicy.css'

export default function PrivacyPolicyPage() {
    return <div>
        <h1 className='privacy-header'>Privacy Policy</h1>
        <div className='text-page-container'>
            <p>Jif Bot stores data only as necessary to operate. Jif Bot does not collect any data beyond that which is available by Discord from any server it is invited to. All data is entirely contained within Jif Bot's operations, and is never shared or sold to any third party for any reason.</p>
            <p>Data collected by Jif Bot is as follows:</p>
            <ul>
                <li>User Ids</li>
                <li>Usernames</li>
                <li>Channel Ids</li>
                <li>Server Ids</li>
                <li>Role Ids</li>
                <li>Message Ids</li>
                <li>Any content submitted by the user</li>
            </ul>
            <p>If you wish to request to view your data, remove it, or have any other inquiries in regards to Jif Bot's data collection, please contact jiffboy on Discord.</p>
            <p>As Jif Bot operates within Discord, please additionally review <a className='privacy-link' href='https://discord.com/privacy'>Discord's Privacy Policy</a>.</p>
        </div>
    </div>
}