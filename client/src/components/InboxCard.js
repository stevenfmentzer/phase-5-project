import React, { useState, useEffect } from 'react';
import { Card } from 'semantic-ui-react';
import '../styling/InboxCard.css'; // Import the CSS file

function InboxCard({ inboxData }) {
    
    return (
        <div className="card-container"> {/* Apply the CSS class */}
            <Card>
                <Card.Content>
                    {/* Apply the CSS class */}
                    <Card.Header className="inbox-name">{`${inboxData.contact_user.first_name} ${inboxData.contact_user.last_name}`}</Card.Header>
                    {/* Display the last message */}
                    <p className="inbox-description">{inboxData.last_message_body}</p>
                </Card.Content>
            </Card>
        </div>
    );
}

export default InboxCard;