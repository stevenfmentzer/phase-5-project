import React, { useState, useEffect } from 'react';
import Inboxes from './Inboxes';
import MessageCard from './MessageCard';
import TextBox from './TextBox';
import '../styling/Messenger.css';

function Messenger({ user }) {
    const [inboxes, setInboxes] = useState([]);
    const [selectedInbox, setSelectedInbox] = useState([]);
    
    useEffect(() => {
        fetch(`http://localhost:5555/user/${user.id}/messages`)
            .then(response => {
                if (response.ok) {
                    response.json().then(inboxes => {
                        setInboxes(inboxes);
                        if (inboxes.length > 0) {
                            setSelectedInbox(inboxes[0]);
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching inbox list:', error);
            });
    }, [user.id]);

    const handleInboxClick = (inboxListId) => {
        console.log(`Click: ${inboxListId}`)
        setSelectedInbox(inboxes[inboxListId]);
    };

    const handleTextBoxSubmit = (formData, route, fetchType) => {
        fetch(`http://localhost:5555/${route}`, {
            method: `${fetchType}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then(textBoxResponse => {
            if (textBoxResponse.ok) {
                return textBoxResponse.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(textBoxData => {
            // After successful POST, fetch messages again
            return fetch(`http://localhost:5555/user/${user.id}/messages`);
        })
        .then(getResponse => {
            if (getResponse.ok) {
                return getResponse.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(inboxes => {
            setInboxes(inboxes);
            if (inboxes.length > 0) {
                setSelectedInbox(inboxes[0]);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div>
            <h3>Messenger</h3>
            <div className="messenger-container">
                <div className="inboxes-container">
                    <Inboxes inboxes={inboxes} onClick={handleInboxClick} />
                </div>
                <div className="messenger-frame-container">
                    <div className="message-cards-container">
                        {selectedInbox.slice(1).map(message => (
                            <MessageCard message={message} user={user} onDelete={handleTextBoxSubmit}/>
                        ))}
                    </div>
                    <div className="text_box_container">
                        <TextBox inbox={selectedInbox} onSubmit={handleTextBoxSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Messenger;