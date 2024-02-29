import React, { useState, useEffect } from 'react';
import Inboxes from './Inboxes';
import MessageCard from './MessageCard';
import TextBox from './TextBox';
import '../styling/Messenger.css';

function Messenger({ user }) {
    const [inboxes, setInboxes] = useState([]);
    const [selectedInbox, setSelectedInbox] = useState([]);
    const [prevSelectedInboxId, setPrevSelectedInboxId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5555/user/${user.id}/messages`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch data');
                }
            })
            .then(inboxes => {
                setInboxes(inboxes);
                if (inboxes.length > 0) {
                    setSelectedInbox(inboxes[prevSelectedInboxId]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching inbox list:', error);
                setError(error);
                setLoading(false);
            });
    }, [user.id]);

    const handleInboxClick = (inboxListId) => {
        setPrevSelectedInboxId(inboxListId);
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
                setPrevSelectedInboxId(prevSelectedInboxId => {
                    setSelectedInbox(inboxes[prevSelectedInboxId]);
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
                return fetch(`http://localhost:5555/user/${user.id}/messages`);
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(getResponse => {
            if (getResponse.ok) {
                return getResponse.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(inboxes => {
            if (inboxes) {
                setInboxes(inboxes);
                if (inboxes.length > 0) {
                    setSelectedInbox(inboxes[prevSelectedInboxId]);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div className="messenger-container">
                <div className="inboxes-container">
                    <Inboxes inboxes={inboxes} onClick={handleInboxClick} />
                </div>
                <div className="messenger-frame-container">
                    <div className="contact_container">
                        <h3 className='contact-name'>{`⭐️ ${selectedInbox[0].contact_user.first_name} ${selectedInbox[0].contact_user.last_name}`}</h3>
                    </div>
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