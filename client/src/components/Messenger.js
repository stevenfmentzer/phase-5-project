import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import useInterval from '../function/useInterval'; 
import MessengerFrame from './MessengerFrame';
import Inboxes from './Inboxes';
import '../styling/Messenger.css';

function Messenger({ user }) {
    const [shouldFetchMessages, setShouldFetchMessages] = useState(false);
    const [selectedInbox, setSelectedInbox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inboxes, setInboxes] = useState([]);
    const [error, setError] = useState(null);
    const messageCardsContainerRef = useRef(null);

    useEffect(() => {
        fetchInboxesAndMessages(); 
        setShouldFetchMessages(true)
    }, [user.id]);

    useInterval(() => {
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
                if (selectedInbox === null) {
                    setSelectedInbox(newInboxes[0]);
                    scrollToBottom()
                } else {
                    const selectedInboxUpdate = newInboxes.find(inbox => inbox[0].inbox_id === selectedInbox[0].inbox_id)
                    if (newInboxes.length > 0) {
                        if (selectedInbox[0].last_message_id != selectedInboxUpdate[0].last_message_id){
                            setSelectedInbox(selectedInboxUpdate);
                            setTimeout(scrollToBottom, 5);
                        } else {
                            setSelectedInbox(selectedInboxUpdate);
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching inbox list:', error);
                setError(error);
            })
            .finally(() => { setLoading(false) });
    };

    function handleInboxClick(inboxListId) {
        setShouldFetchMessages(false)
        const inbox = inboxes.find(inboxArray => inboxArray[0].inbox_id === inboxListId);
        setSelectedInbox(inbox);
        scrollToBottom();
        setTimeout(() => { setShouldFetchMessages(true) }, 200);
    };

    const scrollToBottom = () => {
        if (messageCardsContainerRef.current) {
            messageCardsContainerRef.current.scrollTop = messageCardsContainerRef.current.scrollHeight;
        }
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

    if (error) { return <div>Error: {error.message}</div> }

    return (
        <div className="messenger-container">
            <div className='inboxes-container'> 
                <Inboxes inboxes={inboxes} onClick={handleInboxClick} selectedInbox={selectedInbox}/>
            </div>
            <MessengerFrame
                user={user}
                selectedInbox={selectedInbox}
                fetchInboxesAndMessages={fetchInboxesAndMessages}
                messageCardsContainerRef={messageCardsContainerRef}
            />
        </div>
    );
}

export default Messenger;