import React, { useState } from 'react';
import { Card, Icon, Button } from 'semantic-ui-react';
import '../styling/Friends.css';

function FriendCard({ user, friendship, handleButtonClick }) {
    const [showButtons, setShowButtons] = useState(false);

    let friend;
    let close_friend;
    
    if (user.id === friendship.user1.id) {
        friend = friendship.user2;
        close_friend = friendship.is_close_friend_user1;
    } else {
        friend = friendship.user1;
        close_friend = friendship.is_close_friend_user2;
    }

    const toggleButtons = () => {
        setShowButtons(!showButtons);
    };

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
        handleButtonClick(formData, friendship.id);
    };

    const handleEndFriendButtonClick = () => {
        const formData ={
            is_active : !friendship.is_active
          }
        handleButtonClick(formData, friendship.id)
    };

    return (
        <Card className="friend-card">
            <Card.Content>
                {/* Ellipsis icon button */}
                {/* <Icon name="ellipsis" className="ellipsis-icon" onClick={toggleButtons} /> */}
                <Card.Header className="friend-name">{`${close_friend ? '⭐️ ' : ''} ${friend.first_name} ${friend.last_name}`}</Card.Header>
                <Icon 
                    name="ellipsis horizontal" 
                    style={{ color: 'lightgrey'}} 
                    labelPosition='right' 
                    onClick={toggleButtons}
                />
                {showButtons ? (
                    <div className="button-container">
                        <Button icon labelPosition='left' onClick={handleCloseFriendButtonClick}>
                            <Icon name='star' 
                            style={{color: close_friend ? 'gold' : 'lightgrey'}} />
                            Add to Favorites
                        </Button>
                        <Button icon labelPosition='left' color='red' onClick={handleEndFriendButtonClick}>
                            <Icon name='remove' />
                            Remove Friend
                        </Button>
                    </div>
                ) : (
                    <>
                    <Card.Description>{`Message Count: ${friendship.message_count}`}</Card.Description>
                    </>
                )}
            </Card.Content>
        </Card>
    );
}

export default FriendCard;