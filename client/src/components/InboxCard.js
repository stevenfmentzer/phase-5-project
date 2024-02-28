import React, { useState, useEffect } from 'react';
import { Card } from 'semantic-ui-react';
import '../styling/InboxCard.css'; // Import the CSS file

function InboxCard({ inboxData }) {
    const [truncatedDescription, setTruncatedDescription] = useState(inboxData.last_message_body);

    console.log(`INBOXDATA : ${inboxData}`)

    useEffect(() => {
        if (inboxData.last_message_body.length > 135) {
            // Find the index of the last space character within the first 135 characters
            let lastSpaceIndex = inboxData.last_message_body.lastIndexOf(' ', 135);
            if (lastSpaceIndex === -1) {
                // If no space found, truncate at 135th character
                lastSpaceIndex = 135;
            }
            setTruncatedDescription(inboxData.last_message_body.substring(0, lastSpaceIndex) + '...');
        } else {
            setTruncatedDescription(inboxData.last_message_body);
        }
    }, [inboxData.last_message_body]);
    
    return (
        <div className="card-container"> {/* Apply the CSS class */}
            <Card>
                <Card.Content>
                    {/* Apply the CSS class */}
                    <Card.Header className="inbox-name">{`${inboxData.contact_user.first_name} ${inboxData.contact_user.last_name}`}</Card.Header>
                    {/* Display the last message */}
                    <Card.Description>{truncatedDescription}</Card.Description>
                </Card.Content>
            </Card>
        </div>
    );
}

export default InboxCard;