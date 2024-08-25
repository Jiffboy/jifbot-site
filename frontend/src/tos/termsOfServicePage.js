import React from 'react'
import '../common/css/textPageContainer.css'
import './css/termsOfService.css'

export default function TermsOfServicePage() {
    return <div>
        <h1 className='tos-header'>Terms of Service</h1>
        <div className='text-page-container'>
            <p> By using the Bot, the User agrees to be bound by the terms of this Agreement. If the User does not agree to the terms of this Agreement, they should immediately discontinue use of the Bot. </p>
            <ol>
                <li className='tos-list-item'>
                    <font color="#ffe199">Use of the Bot: </font>
                    The Bot Owner grants the User a non-exclusive, non-transferable, limited license to use the Bot for personal or non-commercial purposes.
                </li>
                <li className='tos-list-item'>
                    <font color="#ffe199">Prohibited Use: </font>
                    The User may not use the Bot in any way that violates applicable laws, rules, or regulations or infringes upon the rights of any third party. The User may not use the Bot for any commercial purposes without the express written consent of the Bot Owner.
                </li>
                <li className='tos-list-item'>
                    <font color="#ffe199">Limitation of Liability: </font>
                    The Bot Owner shall not be liable for any damages arising out of the use or inability to use the Bot, including but not limited to, damages for loss of profits, loss of data, or other intangible losses.
                </li>
                <li className='tos-list-item'>
                    <font color="#ffe199">Modifications to the Bot: </font>
                    The Bot Owner may modify or discontinue the Bot at any time without notice. The User agrees that the Bot Owner shall not be liable to the User or any third party for any modification, suspension, or discontinuance of the Bot.
                </li>
                <li className='tos-list-item'>
                    <font color="#ffe199">Intellectual Property: </font>
                    The Bot and all intellectual property rights therein are and shall remain the property of the Bot Owner. The User agrees not to copy, modify, or distribute the Bot or any portion thereof without the express written consent of the Bot Owner.
                </li>
                <li className='tos-list-item'>
                    <font color="#ffe199">Indemnification: </font>
                    The User agrees to indemnify and hold harmless the Bot Owner, its affiliates, and their respective directors, officers, employees, and agents from any and all claims, damages, liabilities, costs, and expenses, including reasonable attorneys' fees, arising out of the User's use of the Bot.
                </li>
                <li className='tos-list-item'>
                    <font color="#ffe199">Termination: </font>
                    This Agreement may be terminated by either party at any time for any reason. Upon termination, the User must immediately cease all use of the Bot.
                </li>
                <li className='tos-list-item'>
                    <font color="#ffe199">Governing Law: </font>
                    This Agreement shall be governed by and construed in accordance with the laws of the United States of America. Any dispute arising under or in connection with this Agreement shall be resolved by arbitration in accordance with the rules of [Your arbitration provider].
                </li>
                <li className='tos-list-item'>
                    <font color="#ffe199">Entire Agreement: </font>
                    This Agreement constitutes the entire agreement between the parties and supersedes all prior or contemporaneous agreements or representations, whether written or oral, relating to the Bot.
                </li>
            </ol>
            <p>By using the Bot, the User acknowledges that they have read this Agreement, understand it, and agree to be bound by its terms and conditions.</p>
        </div>
    </div>
}