import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Inboxes from './Inboxes';
import MessageCard from './MessageCard';
import useInterval from '../function/useInterval'; 
import TextBox from './TextBox';
import EditTextBox from './EditTextBox';
import '../styling/Messenger.css';

function Messenger({ user }) {
    const [inboxes, setInboxes] = useState([]);
    const [selectedInbox, setSelectedInbox] = useState([]);
    const [prevSelectedInbox, setPrevSelectedInbox] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editMessage, setEditMessage] = useState([]);
    const [messageCardHeight, setMessageCardHeight] = useState(37);
    const [shouldFetchMessages, setShouldFetchMessages] = useState(false);
    const [showDelayForm, setShowDelayForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const prevMessageCountRef = useRef(0);
    const messageCardsContainerRef = useRef(null);

    useEffect(() => {
        fetchInboxesAndMessages(); // Initial fetch
        setShouldFetchMessages(true)
    }, [user.id]);

    // Fetch messages every second, only if shouldFetchMessages is true
    useInterval(() => {
        fetchInboxesAndMessages();
    }, shouldFetchMessages ? 10000 : null);

    const fetchInboxesAndMessages = () => {
        fetch(`http://localhost:5555/user/${user.id}/inbox/`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch data');
                }
            })
            .then(newInboxes => {
                // Update inboxes state
                setInboxes(newInboxes);
                if (newInboxes.length > 0) {
                    if (prevSelectedInbox === null) {
                        setSelectedInbox(newInboxes[0]);
                        setPrevSelectedInbox(newInboxes[0]);
                    } else {
                        const updatedSelectedInbox = newInboxes.find(inboxArray => inboxArray[0].inbox_id === prevSelectedInbox[0].inbox_id);
                        setSelectedInbox(updatedSelectedInbox);
                        setPrevSelectedInbox(updatedSelectedInbox);
                    }
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching inbox list:', error);
                setError(error);
                setLoading(false);
            });
    };
    

    useEffect(() => {
        // Check if new messages were received
        const messageCount = selectedInbox?.length || 0;
        if (messageCount > prevMessageCountRef.current) {
            scrollToBottom();
        }
        prevMessageCountRef.current = messageCount;
    }, [selectedInbox]);

    function handleInboxClick(inboxListId) {
        setIsEditMode(false);
        const inbox = inboxes.find(inboxArray => inboxArray[0].inbox_id === inboxListId);
        setSelectedInbox(inbox)
        setPrevSelectedInbox(inbox);
        scrollToBottom()
    };

    const scrollToBottom = () => {
        if (messageCardsContainerRef.current) {
            messageCardsContainerRef.current.scrollTop = messageCardsContainerRef.current.scrollHeight;
        }
    };

    const handleTextBoxSubmit = (formData, route, fetchType) => {
        console.log(route)
        console.log(fetchType)
        console.log(formData)
        fetch(`http://localhost:5555/${route}`, {
            method: `${fetchType}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then(getResponse => {
            console.log(getResponse)
            if (getResponse.ok) {
                return getResponse.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // Refetch inboxes and messages
            fetchInboxesAndMessages();
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
                fetchInboxesAndMessages(); // Fetch updated inboxes after successful message deletion
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleEditMessage = (message) => {
        setEditMessage(message);
        setIsEditMode(true);
    };

    const handleHeightChange = (height) => {
        setMessageCardHeight(height);
    };

    if (loading) {
      return (
        <div className="spinner-container">
          <div className="spinner-wrapper">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" style={{ color: 'lightgrey' }} />
          </div>
        </div>
      );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="messenger-container">
            <div className='inboxes-container'> 
                <Inboxes inboxes={inboxes} onClick={handleInboxClick} selectedInbox={selectedInbox}/>
            </div>
            <div className='messenger-frame-container'>
                <div className="contact-wrapper">
                    <div className="contact-background-blur"></div>
                    <div className="contact-overlay"></div>
                    <div className="contact-container">
                        <h3 className='contact-name'>{selectedInbox[0].contact_user.first_name} {selectedInbox[0].contact_user.last_name}</h3>
                    </div>
                </div>
                <div className="message-cards-container" ref={messageCardsContainerRef}>
                    <div style={{ height: '60px' }}></div>
                    {selectedInbox.slice(1).map(message => (
                        message.is_sent ? 
                        <MessageCard key={message.id} message={message} user={user} onDelete={handleDeleteRequest} handleEditMessage={handleEditMessage} editMessage={editMessage} isEditMode={isEditMode}/>
                        :<></>
                    ))}
                    <div style={{ height: `${messageCardHeight + 14}px` }}></div>
                </div>
                {isEditMode
                    ? <EditTextBox 
                        onSubmit={handleTextBoxSubmit} 
                        editMessage={editMessage} 
                        setEditMessage={setEditMessage} 
                        onHeightChange={handleHeightChange} 
                        setIsEditMode={setIsEditMode} 
                    /> 
                    : <TextBox 
                        inbox={selectedInbox} 
                        onSubmit={handleTextBoxSubmit} 
                        onHeightChange={handleHeightChange} 
                        showDelayForm={showDelayForm}
                        setShowDelayForm={setShowDelayForm}
                    /> }
            </div>
        </div>
    );
}

export default Messenger;