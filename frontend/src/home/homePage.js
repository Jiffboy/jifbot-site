import React from 'react'
import '../common/css/textPageContainer.css'
import Cell from './cell'
import './css/home.css'
import lookupImg from '../resources/lookup.png'
import roleplayImg from '../resources/roleplay.png'
import decisionImg from '../resources/decision.png'
import toolImg from '../resources/tool.png'
import otherImg from '../resources/other.png'

export default function HomePage() {
    return <div className="text-page-container">
        <h1 className="home-header">Welcome to Jif Bot</h1>
        <h2 className="home-subheader">The Handy Dandy Helper Bot</h2>
        <p className="home-welcome">A shitpost bot turned personal assistant. Designed specifically to meet my own
            needs, Jif Bot has various functionality to aid in discussion, provide basic tools, and bolsters some
            additional goodies that nobody wants or needs! Feel free to add my son to your server and give it a
            try! </p>
        <a className="invite-button" href="https://discord.com/oauth2/authorize?client_id=315569278101225483">Invite
            me!</a>
        <hr className="home-divider"/>
        <h1 className="home-header">Features</h1>
        <div className="cards-container">
            <Cell title="In-App Lookups"
                  description="Experience the thrill of being able to pull up information to help contribute to a conversation without having to use Google!"
                  list={["English Dictionary", "Urban Dictionary", "League of Legends Stats", "Movies", "YouTube"]}
                  image={lookupImg} left={true}/>
            <Cell title="Decision Making"
                  description="Free your soul from the crushing weight of indecision by allowing rng to dictate your fate!"
                  list={["Randomly choose an item from a list", "Shake a magic 8 ball", "Distribute people into teams", "Roll dice"]}
                  image={decisionImg} left={false}/>
            <Cell title="General Tooling" description="Basic functionality done by other bots, but with a cute lil fox!"
                  list={["Set timers to remind yourself and others", "Set up an alerts channel to post event reports (user join/leave etc)", "Post a message to allow users to assign themselves roles", "Fetch user avatars"]}
                  image={toolImg} left={true}/>
            <Cell title="Blorbopedia"
                  description="Submit and view roleplay characters to create wiki-like entries for them! Useful for roleplaying communities to make surface level biographies that are quick to access from discord itself, or to browse through here on this very website! (coming soon)"
                  list={["Additional roleplay features to come, probably!"]} image={roleplayImg} left={false}/>
            <Cell title="All The Other Stuff"
                  description="Be subjected to a myriad of bizarre features that exist solely to satiate my own whimsy!"
                  list={["Shitposts that trigger on keywords (You can turn it off)", "Commands for reaction images", "Jokes, fun facts, and inspirational quotes"]}
                  image={otherImg} left={true}/>
        </div>
    </div>
}
