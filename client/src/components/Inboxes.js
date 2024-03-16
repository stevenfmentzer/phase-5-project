import React, { useState, useEffect } from 'react';
import InboxCard from './InboxCard';
import '../styling/Inbox.css';

function Inboxes({ inboxes, onClick, selectedInbox }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        // Set selectedIndex when selectedInbox changes
        const index = inboxes.findIndex(inboxArray => inboxArray[0].inbox_id === selectedInbox[0].inbox_id);
        setSelectedIndex(index);
    }, [selectedInbox, inboxes]);

    return (
        <div className="inbox">
            {inboxes.map((inboxArray, index) => {
                const inboxData = inboxArray[0]; // Accessing the inbox data from the first element
                const inboxId = inboxData.inbox_id; // Get the inbox ID
                const isSelected = inboxId === selectedInbox[0].inbox_id; // Check if this inbox is selected
                const isAfterSelected = index === selectedIndex + 1; // Check if this inbox is directly after the selected one
                const isFirstInList = index === 0; // Check if this inbox is the first in the list
                const shouldDisplayLine = !isSelected && !isAfterSelected && !isFirstInList; // Determine if the line should be displayed
                return (
                    <div className="card-container" key={inboxId} onClick={() => onClick(inboxId)}>
                        {shouldDisplayLine && <div className="horizontal-line"></div>} {/* Conditionally render the horizontal line */}
                        <InboxCard inboxData={inboxData} isSelected={isSelected} />
                    </div>
                );
            })}
        </div>
    );
}

export default Inboxes;