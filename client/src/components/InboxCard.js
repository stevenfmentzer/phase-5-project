import React from 'react';
import { Card } from 'semantic-ui-react';
import '../styling/InboxCard.css'; // Import the CSS file

function InboxCard({ inbox }) {
  // Dummy data for last message
  const lastMessage = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  return (
    <div className="card-container"> {/* Apply the CSS class */}
      <Card>
        <Card.Content>
          {/* Apply the CSS class */}
          <Card.Header className="inbox-name">{inbox.name}</Card.Header>
          {/* Display the last message */}
          <Card.Description>{lastMessage}</Card.Description>
        </Card.Content>
      </Card>
    </div>
  );
}

export default InboxCard;