import React, { useState, useEffect, useRef } from 'react';
import Inboxes from './Inboxes';
import MessageCard from './MessageCard';
import TextBox from './TextBox';
import EditTextBox from './EditTextBox'; // Import the EditTextBox component
import '../styling/Messenger.css';

function Messenger({ user }) {
    const [inboxes, setInboxes] = useState([]);
    const [selectedInbox, setSelectedInbox] = useState([]);
    const [prevSelectedInboxId, setPrevSelectedInboxId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editMessage, setEditMessage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messageCardHeight, setMessageCardHeight] = useState(37);
    const messageCardsContainerRef = useRef(null);
    const [delayTime, setDelayTime] = useState(0); // Add delayTime state

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

    useEffect(() => {
        scrollToBottom(); // Scroll to bottom when component mounts or selectedInbox changes
    }, [selectedInbox]);

    // Reset delayTime when selectedInbox changes
    useEffect(() => {
        setDelayTime(0);
    }, [selectedInbox]);

    const handleInboxClick = (inboxListId) => {
        setPrevSelectedInboxId(inboxListId);
        setSelectedInbox(inboxes[inboxListId]);
        setIsEditMode(false); // Set isEditMode to false when a new inbox is clicked
        setMessageCardHeight(37); // Reset messageCardHeight when a new inbox is chosen
        scrollToBottom();
    };

    const scrollToBottom = () => {
        if (messageCardsContainerRef.current) {
            messageCardsContainerRef.current.scrollTop = messageCardsContainerRef.current.scrollHeight;
        }
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
            scrollToBottom(); // Scroll to bottom after new messages are fetched
            setMessageCardHeight(37); // Reset messageCardHeight after form submission
    
            // Reset the textarea style height
            const textarea = document.querySelector('.textbox-container textarea');
            if (textarea) {
                textarea.style.height = 'auto';
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
                scrollToBottom(); // Scroll to bottom after message deletion
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleEditMessage = (message) => {
        setEditMessage(message)
        setIsEditMode(true)
    }

    const toggleEditMessage = (message) => {
        setEditMessage(message)
        setIsEditMode(true)
    }

    // Callback function to receive height value from EditTextBox
    const handleHeightChange = (height) => {
        setMessageCardHeight(height);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    return (
        <div className="messenger-container"> {/* Wrap the entire component in a container */}
            <div className="inboxes-container">
                <Inboxes inboxes={inboxes} onClick={handleInboxClick} selectedInboxIndex={prevSelectedInboxId}/>
            </div>
            <div className="messenger-frame-container">
                <div className="contact-wrapper">
                    <div className="contact-background-blur"></div>
                    <div className="contact-overlay"></div>
                    <div className="contact-container">
                        <h3 className='contact-name'>{`⭐️ ${selectedInbox[0].contact_user.first_name} ${selectedInbox[0].contact_user.last_name}`}</h3>
                    </div>
                </div>
                <div className="message-cards-container" ref={messageCardsContainerRef}>
                     <div style={{ height: '60px' }}></div> {/* Use message card height here */}
                    {selectedInbox.slice(1).map(message => (
                        <MessageCard key={message.id} message={message} user={user} onDelete={handleDeleteRequest} handleEditMessage={handleEditMessage} editMessage={editMessage} isEditMode={isEditMode}/>
                    ))}
                   <div style={{ height: `${messageCardHeight + 14}px` }}></div>
                </div>
                {isEditMode
                    ? <EditTextBox onSubmit={handleTextBoxSubmit} editMessage={editMessage} setEditMessage={setEditMessage} onHeightChange={handleHeightChange} setIsEditMode={setIsEditMode} /> 
                    : <TextBox inbox={selectedInbox} onSubmit={handleTextBoxSubmit} onHeightChange={handleHeightChange} /> }
            </div>
        </div>
    );
}

export default Messenger;