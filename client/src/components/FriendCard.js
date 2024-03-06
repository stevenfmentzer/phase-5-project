import React, { useState, useRef, useEffect } from 'react';
import { Card, Icon, Button } from 'semantic-ui-react';
import EditFriendCard from './EditFriendCard';
import '../styling/FriendCard.css';

function FriendCard({ user, friendship, handleButtonClick }) {
    const [showButtons, setShowButtons] = useState(false);
    const editRef = useRef(null);
    const ellipsisRef = useRef(null);

    let friend;
    let close_friend;
    
    if (user.id === friendship.user1.id) {
        friend = friendship.user2;
        close_friend = friendship.is_close_friend_user1;
    } else {
        friend = friendship.user1;
        close_friend = friendship.is_close_friend_user2;
    }


    const handleCloseFriendButtonClick = () => {
        let formData;
        if (user.id === friendship.user1.id) {
            formData = {
                is_close_friend_user1: !friendship.is_close_friend_user1
            };
        } else { 
            formData = {
                is_close_friend_user2: !friendship.is_close_friend_user2
            };
        }
        handleButtonClick(formData, friendship.id, 'PATCH');
    };

    const handleEndFriendButtonClick = () => {
        const formData ={
            is_active : !friendship.is_active
          }
          console.log(formData)
        handleButtonClick(formData, friendship.id, 'PATCH')
    };


    const toggleButtons = () => {
        setShowButtons(!showButtons);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                editRef.current &&
                !editRef.current.contains(event.target) &&
                event.target !== ellipsisRef.current // Check if the clicked target is the ellipsis icon
            ) {
                setShowButtons(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleEllipsisClick = (event) => {
        event.stopPropagation(); // Prevent the click event from propagating to the document
        toggleButtons(); // Toggle the visibility of the edit options
    };

    return (
        <Card className="friend-card">
            <div className="friend-card-left">
                <Icon name='user circle huge' className="icon-user" />
                {close_friend ? (
                    <Icon name='star' className='icon-favorite' />
                ) : (
                    <></>
                )}
            </div>
            <div className="friend-card-right">
                <Card.Header className="friend-name">{`${friend.first_name} ${friend.last_name}`}</Card.Header>
                <Card.Description>{`Message Count: ${friendship.message_count}`}</Card.Description>
                <Card.Description>{`Reached Out: ${friendship.message_count}`}</Card.Description>
                <Card.Description>{`Last Contact: xx/xx/xx`}</Card.Description>
            </div>
            <Icon
                name="ellipsis horizontal"
                className='icon-ellipsis'
                onClick={handleEllipsisClick}
                ref={ellipsisRef}
            />
            {showButtons ? (
                <div ref={editRef}>
                    <EditFriendCard
                        onCloseFriendClick={() => handleCloseFriendButtonClick()}
                        onRemoveClick={() => handleEndFriendButtonClick()}
                    />
                </div>
            ) : <></>}
        </Card>
    );
}

export default FriendCard;