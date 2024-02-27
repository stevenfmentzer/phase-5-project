import React, { useState } from 'react';
import { Card, Icon } from 'semantic-ui-react';

function MessageCard({ message, user, onDelete }) {
    const { sender_id, message_body } = message;

    const isSentByCurrentUser = sender_id === user.id;

    const alignment = isSentByCurrentUser ? 'flex-end' : 'flex-start';

    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [hoverDeleteButton, setHoverDeleteButton] = useState(false);

    const handleDelete = () => {
        // Call onDelete function when the 'x' button is clicked
        onDelete('', `message/${message.id}`, 'DELETE');
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
                position: 'relative', // Ensure relative positioning for the container
            }}
            onMouseLeave={handleHideDeleteButton} // Hide delete button when mouse leaves the container
        >
            {/* Render the delete button */}
            {showDeleteButton && isSentByCurrentUser && (
                <div
                    style={{
                        position: 'absolute',
                        top: '5px',
                        left: '5px', // Adjust this value to position the button to the left
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
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: hoverDeleteButton ? '#ff7e7c' : '#ffb0af', // Darker color on hover
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon name="times circle" color="white" />
                    </div>
                </div>
            )}
            <Card
                fluid
                style={{
                    maxWidth: '70%', // Adjust this value as needed
                    backgroundColor: showDeleteButton && isSentByCurrentUser && hoverDeleteButton ? '#ffc9c9' : (showDeleteButton && isSentByCurrentUser ? '#ffb0af' : (isSentByCurrentUser ? '#DCF8C6' : '#EDEDED')),                    borderRadius: '10px',
                    padding: '10px',
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