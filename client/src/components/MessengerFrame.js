import React, { useEffect, useState } from 'react';
import MessageCard from './MessageCard';
import TextBox from './TextBox';
import EditTextBox from './EditTextBox';

function MessengerFrame({ user, selectedInbox, fetchInboxesAndMessages, messageCardsContainerRef }) {

        const [showDelayForm, setShowDelayForm] = useState(false);
        const [isEditMode, setIsEditMode] = useState(false);
        const [editMessage, setEditMessage] = useState([]);
        const [messageCardHeight, setMessageCardHeight] = useState(37);
    
    
        const handleTextBoxSubmit = (formData, route, fetchType) => {
            fetch(`http://localhost:5555/${route}`, {
                method: `${fetchType}`,
                headers: { "Content-Type": "application/json",},
                body: JSON.stringify(formData),
            })
            .then(response => {
                fetchInboxesAndMessages();
            })
            .catch(error => {
                console.error('Error:', error);
            })
        };
    
        const handleDeleteRequest = (message_id) => {
            fetch(`http://localhost:5555/message/${message_id}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json",},
            })
            .then(response => {
                fetchInboxesAndMessages();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        };
    
        const handleHeightChange = (height) => {
            setMessageCardHeight(height);
        };
        
        const handleEditMessage = (message) => {
            if (message === null) {
                setEditMessage([]);
                setIsEditMode(false);
            } else {
                setEditMessage(message);
                setIsEditMode(true);
            }
        };

        useEffect(() => {
            handleEditMessage(null)
        }, [selectedInbox[0]?.inbox_id]);

    return (
        <div className='messenger-frame-container'>
            <div className="contact-wrapper">
                <div className="contact-background-blur"></div>
                <div className="contact-overlay"></div>
                <div className="contact-container">
                    <h3 className='contact-name'>{selectedInbox[0].contact_user.first_name} {selectedInbox[0].contact_user.last_name}</h3>
                </div>
            </div>
            <div className="message-cards-container" ref={messageCardsContainerRef}>
                <div style={{ height: '60px' }}/>
                {selectedInbox.slice(1).map(message => (
                    message.is_sent ? 
                    <MessageCard key={message.id} message={message} user={user} onDelete={handleDeleteRequest} handleEditMessage={handleEditMessage} editMessage={editMessage} isEditMode={isEditMode}/>
                    :<></>
                ))}
                <div style={{ height: `${messageCardHeight + 14}px` }}/>
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
    );
}

export default MessengerFrame;