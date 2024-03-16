import React from 'react';
import InboxCard from './InboxCard';
import '../styling/Inbox.css';

function Inboxes({ inboxes, onClick, selectedInboxIndex }) {

    return (
        <div className="inbox">
            {inboxes.map((inboxArray, index) => {
                const inboxData = inboxArray[0]; // Accessing the inbox data from the first element
                const isSelected = index === selectedInboxIndex; // Check if this inbox is selected
                const isAfterSelected = index === selectedInboxIndex + 1; // Check if this inbox is directly after the selected one
                const isFirstInList = index === 0; // Check if this inbox is the first in the list
                const shouldDisplayLine = !isSelected && !isAfterSelected && !isFirstInList; // Determine if the line should be displayed
                return (
                    <div className="card-container" key={inboxData.inbox_id} onClick={() => onClick(index)}>
                        {shouldDisplayLine && <div className="horizontal-line"></div>} {/* Conditionally render the horizontal line */}
                        <InboxCard inboxData={inboxData} isSelected={isSelected} />
                    </div>
                );
            })}
        </div>
    );
}

export default Inboxes;