import React from 'react';
import Inboxes from './Inboxes'
import MessageCard from './MessageCard'
import '../styling/Messenger.css'; // Import CSS for styling

function Messenger() {
    return (
        <div>
        <h3>Messenger</h3>
        <div className="messenger-container">
        <div className="inboxes-container">
            <Inboxes />
        </div>
        <div className="messenger-frame-container">
            <div className="message-cards-container">
            {/* List of MessageCards */}
            <MessageCard />
            <MessageCard />
            {/* Add more MessageCard components as needed */}
            </div>
        </div>
        </div>
        </div>
    );
}

export default Messenger;