import React from 'react';
import { Card } from 'semantic-ui-react';
import '../styling/InboxCard.css'; 

function InboxCard({ inboxData, isSelected }) {
    return (
        <div className={`card-container ${isSelected ? 'selected' : ''}`}> 
            <Card>
                <Card.Content>
                    <Card.Header className={`inbox-name ${isSelected ? 'selected' : ''}`}>
                        {`${inboxData.contact_user.first_name} ${inboxData.contact_user.last_name}`}
                    </Card.Header>
                    <p className="inbox-description">{inboxData.last_message_body}</p>
                </Card.Content>
            </Card>
        </div>
    );
}

export default InboxCard;