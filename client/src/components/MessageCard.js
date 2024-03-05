import React, { useEffect, useState } from 'react';
import { Card, Icon } from 'semantic-ui-react';

function MessageCard({ message, user, onDelete, handleEditMessage, editMessage, isEditMode }) {
    const { sender_id, message_body } = message;
    const isSentByCurrentUser = sender_id === user.id;
    const alignment = isSentByCurrentUser ? 'flex-end' : 'flex-start';

    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [hoverDeleteButton, setHoverDeleteButton] = useState(false);
    const [isBlurred, setIsBlurred] = useState(false);

    const handleDelete = () => {
        onDelete(message.id);
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        setShowDeleteButton(true);
    };

    const handleHideDeleteButton = () => {
        // Only hide the delete button if not in edit mode
        if (!isEditMode) {
            setShowDeleteButton(false);
        }
    };

    const handleEdit = () => {
        handleEditMessage(message);
        // Reset the delete button visibility
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
        <div
            style={{
                display: 'flex',
                flexDirection: 'column', // Adjusted to display buttons underneath
                alignItems: alignment,
                margin: '10px',
                position: 'relative',
                zIndex: isBlurred ? '-1' : '1',
            }}
            onMouseLeave={handleHideDeleteButton}
        >
            <Card
                fluid
                style={{
                    maxWidth: '70%', // Adjust this value as needed
                    backgroundColor: isSentByCurrentUser ? '#5EA2E4' : '#DCD92E',
                    borderRadius: '15px',
                    padding: '10px',
                }}
                onContextMenu={handleRightClick} // Show delete button on right-click
            >
                <Card.Content>
                    <Card.Description 
                        style={{ 
                            textAlign: 'left', 
                            color: isSentByCurrentUser ? '#FEFEFB' : '#1F1F05',
                            filter: isBlurred ? 'blur(2px)' : 'none', // Apply blur filter to text if message id matches editMessage id
                        }}
                    >
                        {message_body}
                    </Card.Description>
                </Card.Content>
            </Card>
            {/* Render the buttons underneath the main card */}
            {showDeleteButton && isSentByCurrentUser && !isEditMode &&(
                <div className='edit-message-button-wrapper'
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '6px', // Adjust spacing between card and buttons
                    }}
                >
                    {/* Delete button */}
                    <div className='message-delete'
                        style={{
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            backgroundColor: hoverDeleteButton ? '#F4A261' : '#f47d61', // Darker color on hover
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            marginRight: '7px', // Adjust spacing between buttons
                        }}
                        onClick={handleDelete}
                        onMouseEnter={() => setHoverDeleteButton(true)}
                        onMouseLeave={() => setHoverDeleteButton(false)}
                    >
                        <Icon name="small times" style={{ color: 'white', marginLeft: '3.5px' }} />
                    </div>
                    {/* EDIT BUTTON */}
                    <div className='message-edit'
                        style={{
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            backgroundColor: '#5EA2E4', // Adjust color as needed
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            marginRight: '2px',
                        }}
                        onClick={handleEdit}
                    >
                        <Icon name="pencil alternate small" style={{ color: 'white', marginLeft: '5px' }} /> {/* Replace with your own icon */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageCard;