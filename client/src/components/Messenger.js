import React, { useState, useEffect } from 'react';
import Inboxes from './Inboxes';
import MessageCard from './MessageCard';
import TextBox from './TextBox';
import '../styling/Messenger.css';

function Messenger({ user }) {
    const [inboxes, setInboxes] = useState([]);
    const [selectedInbox, setSelectedInbox] = useState([]);
    const [prevSelectedInboxId, setPrevSelectedInboxId] = useState(0);

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
        setPrevSelectedInboxId(inboxListId); // Update the previously selected inbox ID
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
        .then(getResponse => {
            if (getResponse.ok) {
                console.log('First fetch succeeded');
                return getResponse.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
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
            console.log('Received inboxes:', inboxes);
            setInboxes(inboxes);
            if (inboxes.length > 0) {
                setPrevSelectedInboxId(prevSelectedInboxId => {
                    setSelectedInbox(inboxes[prevSelectedInboxId]);
                    console.log(`SELECTED INBOX : ${selectedInbox}`)
                    return prevSelectedInboxId;
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleDeleteRequest = (message_id) => {
        fetch(`http://localhost:5555/message/${message_id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            if (response.ok) {
                console.log('DELETE request succeeded');
                // Proceed with the second fetch
                return fetch(`http://localhost:5555/user/${user.id}/messages`);
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(getResponse => {
            if (getResponse.ok) {
                console.log('Second fetch triggered');
                return getResponse.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(inboxes => {
            if (inboxes) {
                console.log("RECIEVED INBOXES")
                console.log('Received inboxes:', inboxes);
                setInboxes(inboxes);
                if (inboxes.length > 0) {
                    setSelectedInbox(inboxes[prevSelectedInboxId]);
                    console.log(`SELECTED INBOX : ${selectedInbox}`)
                }
            } else {
                console.log('No inboxes received');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
    
    return (
        <div>
            <div className="messenger-container">
                <div className="inboxes-container">
                    <Inboxes inboxes={inboxes} onClick={handleInboxClick} />
                </div>
                <div className="messenger-frame-container">
                    <div className="message-cards-container">
                        {selectedInbox.slice(1).map(message => (
                            <MessageCard key={message.id} message={message} user={user} onDelete={handleDeleteRequest}/>
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