import React, { useEffect, useState } from 'react';
import { Card, Icon } from 'semantic-ui-react';
import '../styling/MessageCard.css';

function MessageCard({ message, user, onDelete, handleEditMessage, editMessage, isEditMode }) {
    const isSentByCurrentUser = message.sender_id === user.id;

    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [isBlurred, setIsBlurred] = useState(false);

    const handleDelete = () => {
        onDelete(message.id);
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        setShowDeleteButton(true);
    };

    const handleHideDeleteButton = () => {
        if (!isEditMode) {
            setShowDeleteButton(false);
        }
    };

    const handleEdit = () => {
        handleEditMessage(message);
        setShowDeleteButton(false);
    };

    useEffect(() => {
        if (message.id === editMessage.id) {
            setIsBlurred(true);
        } else {
            setIsBlurred(false);
        }
    }, [message.id, editMessage.id]);

    return (
        <div className='message-span'
            onMouseLeave={handleHideDeleteButton}
        >
            <Card
                className={isSentByCurrentUser ? 'message-sent-by-current-user' : 'message-sent-by-other-user'}
                onContextMenu={handleRightClick}
            >
                <Card.Content>
                    <Card.Description className={isBlurred ? 'pulsating' : ''}>
                        {message.message_body}
                    </Card.Description>
                </Card.Content>
            </Card>

            {/* Render the buttons underneath the main card */}
            {showDeleteButton && isSentByCurrentUser && !isEditMode &&(
                <div className='edit-message-button-wrapper'>
                    {/* DELETE BUTTON */}
                    <div className='message-delete' onClick={handleDelete}>
                        <Icon name="small times"/>
                    </div>
                    {/* EDIT BUTTON */}
                    <div className='message-edit' onClick={handleEdit}>
                        <Icon name="pencil alternate small"/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageCard;