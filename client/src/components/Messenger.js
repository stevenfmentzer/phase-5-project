import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'semantic-ui-react';
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
    const [prevSelectedInboxId, setPrevSelectedInboxId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editMessage, setEditMessage] = useState([]);
    const [messageCardHeight, setMessageCardHeight] = useState(37);
    const [shouldFetchMessages, setShouldFetchMessages] = useState(true);
    const [showDelayForm, setShowDelayForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const prevMessageCountRef = useRef(0);
    const messageCardsContainerRef = useRef(null);

    
    useEffect(() => {
        setShouldFetchMessages(false)
        fetchInboxesAndMessages(); // Initial fetch
        setShouldFetchMessages(true)
    }, [user.id]);

    // Fetch messages every second, only if shouldFetchMessages is true
    useInterval(() => {
        fetchInboxesAndMessages();
    }, shouldFetchMessages ? 1000 : null);

    const fetchInboxesAndMessages = () => {
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
    };

    useEffect(() => {
        // Check if new messages were received
        const messageCount = selectedInbox?.length || 0;
        if (messageCount > prevMessageCountRef.current) {
            scrollToBottom();
        }
        prevMessageCountRef.current = messageCount;
    }, [selectedInbox]);

    const handleInboxClick = async (inboxListId) => {
        setShouldFetchMessages(false); // Disable interval when clicking an inbox
        setSelectedInbox(inboxes[inboxListId]);
        setPrevSelectedInboxId(inboxListId);
        setIsEditMode(false);
        setMessageCardHeight(37);
        
        try {
            const response = await fetch(`http://localhost:5555/user/${user.id}/messages`);
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const inboxesData = await response.json();
            setInboxes(inboxesData);
            setSelectedInbox(inboxesData[inboxListId]); // Update the selected inbox after fetching messages
            scrollToBottom();
            setShouldFetchMessages(true);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError(error);
        };
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
            setMessageCardHeight(37);
            const textarea = document.querySelector('.textbox-container textarea');
            if (textarea) {
                textarea.style.height = 'auto';
            }
            setShouldFetchMessages(true); // Re-enable interval after submitting the text box
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
                scrollToBottom();
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
            <div className="inboxes-container">
                <Inboxes inboxes={inboxes} onClick={handleInboxClick} selectedInboxIndex={prevSelectedInboxId}/>
            </div>
            <div className="messenger-frame-container">
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