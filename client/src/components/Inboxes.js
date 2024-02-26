import React from 'react';
import InboxCard from './InboxCard';
import '../styling/Inbox.css'; // Import the CSS file

function Inboxes() {
  // Dummy data for inboxes
  const inboxes = [
    { id: 1, name: 'Inbox 1' },
    { id: 2, name: 'Inbox 2' },
    { id: 3, name: 'Inbox 3' },
  ];

  return (
    <div className="container"> {/* Apply the CSS class */}
      {inboxes.map((inbox) => (
        <div className="card-container" key={inbox.id}> {/* Apply the CSS class */}
          <InboxCard inbox={inbox} />
        </div>
      ))}
    </div>
  );
}

export default Inboxes;