import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import '../styling/EditFriendCard.css';

function EditFriendCard({ onCloseFriendClick, onRemoveClick }) {
    return (
        <div className="edit-friend-card-container">
            <div className="button-container">
            <Button className="edit-button" onClick={onCloseFriendClick}>
                <Icon name='star' className="icon-edit-user" />
            </Button>
            <Button className="edit-button" onClick={onRemoveClick}>
                <Icon name='user times' className="icon-edit-user"/>
            </Button>
            </div>
        </div>
    );
}

export default EditFriendCard;