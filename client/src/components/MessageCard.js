import React, { useState } from 'react';
import { Card, Icon } from 'semantic-ui-react';
import TextBox from './TextBox';

function MessageCard({ message, user, onDelete }) {
    const { sender_id, message_body } = message;

    const isSentByCurrentUser = sender_id === user.id;

    const alignment = isSentByCurrentUser ? 'flex-end' : 'flex-start';

    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [hoverDeleteButton, setHoverDeleteButton] = useState(false);

    const handleDelete = () => {
        onDelete(message.id);
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        setShowDeleteButton(true);
    };

    const handleHideDeleteButton = () => {
        setShowDeleteButton(false);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: alignment,
                margin: '10px',
                position: 'relative',
            }}
            onMouseLeave={handleHideDeleteButton}
        >
            {/* Render the delete button */}
            {showDeleteButton && isSentByCurrentUser && (
                <div
                    style={{
                        position: 'absolute',
                        top: '5px',
                        left: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={handleDelete}
                    onMouseEnter={() => setHoverDeleteButton(true)}
                    onMouseLeave={() => setHoverDeleteButton(false)}
                >
                    <div
                        style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: hoverDeleteButton ? '#F4A261' : '#f47d61', // Darker color on hover
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon name="times" style={{ color: 'white', marginLeft: '3.5px' }} />
                    </div>
                </div>
            )}
            <Card
                fluid
                style={{
                    maxWidth: '70%', // Adjust this value as needed
                    backgroundColor: showDeleteButton && isSentByCurrentUser && hoverDeleteButton ? '#ffc9c9' : (showDeleteButton && isSentByCurrentUser ? '#ffb0af' : (isSentByCurrentUser ? '#DCF8C6' : '#EDEDED')),                    borderRadius: '10px',
                    padding: '10px',
                    borderRadius: '10px'
                }}
                onContextMenu={handleRightClick} // Show delete button on right-click
            >
                <Card.Content>
                    <Card.Description style={{ textAlign: 'left' }}>{message_body}</Card.Description>
                </Card.Content>
            </Card>
        </div>
    );
}

export default MessageCard;