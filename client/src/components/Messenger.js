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
        // Initial fetch for all Inboxes and Messages
        fetchInboxesAndMessages(); 
        //Turn on useInterval fetch after content loads
        setShouldFetchMessages(true)
    }, [user.id]);

    useEffect(() => {
        // Check if new messages were received
        const messageCount = selectedInbox?.length || 0;
        if (messageCount > prevMessageCountRef.current) {
            scrollToBottom();
        }
        prevMessageCountRef.current = messageCount;
    }, [selectedInbox]);

    useInterval(() => {
        // Fetch messages every second, only if shouldFetchMessages is true
        console.log("cycle")
        fetchInboxesAndMessages();
    }, shouldFetchMessages ? 1000 : null);

    const fetchInboxesAndMessages = () => {
        fetch(`http://localhost:5555/user/${user.id}/inbox`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch data');
                }
            })
            .then(newInboxes => {
                setInboxes(newInboxes);
                if (newInboxes.length > 0) {
                    if (prevSelectedInbox === null) {
                        setSelectedInbox(newInboxes[0]);
                        setPrevSelectedInbox(newInboxes[0]);
                    } else {
                        const updatedSelectedInbox = newInboxes.find(inboxArray => inboxArray[0].inbox_id === prevSelectedInbox[0].inbox_id);
                        setSelectedInbox(updatedSelectedInbox);
                        setPrevSelectedInbox(updatedSelectedInbox);
                }}
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching inbox list:', error);
                setError(error);
                setLoading(false);
            });
    };


    function handleInboxClick(inboxListId) {
        setShouldFetchMessages(false); // Disable interval fetching
        setIsEditMode(false);
        const inbox = inboxes.find(inboxArray => inboxArray[0].inbox_id === inboxListId);
        setSelectedInbox(inbox);
        setPrevSelectedInbox(inbox);
        scrollToBottom();
        
        // Set a delay before re-enabling interval fetching
        setTimeout(() => {
            setShouldFetchMessages(true);
        }, 250);
    }

    const handleTextBoxSubmit = (formData, route, fetchType) => {
        fetch(`http://localhost:5555/${route}`, {
            method: `${fetchType}`,
            headers: { "Content-Type": "application/json",},
            body: JSON.stringify(formData),
        })
        .then(response => {
            // Refetch inboxes and messages w/ new data
            fetchInboxesAndMessages();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleDeleteRequest = (message_id) => {
        fetch(`http://localhost:5555/message/${message_id}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json",},
        })
        .then(response => {
            // Fetch updated inboxes after successful message deletion
            fetchInboxesAndMessages();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const scrollToBottom = () => {
        if (messageCardsContainerRef.current) {
            messageCardsContainerRef.current.scrollTop = messageCardsContainerRef.current.scrollHeight;
        }
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