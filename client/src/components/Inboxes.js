import React from 'react';
import InboxCard from './InboxCard';
import '../styling/Inbox.css';

function Inboxes({ inboxes, onClick, selectedInboxIndex }) {

    return (
        <div className="inbox">
            {inboxes.map((inboxArray, index) => {
                const inboxData = inboxArray[0]; // Accessing the inbox data from the first element
                const isSelected = index === selectedInboxIndex; // Check if this inbox is selected
                return (
                    <div className="card-container" key={inboxData.inbox_id} onClick={() => onClick(index)}>
                        <InboxCard inboxData={inboxData} isSelected={isSelected} />
                    </div>
                );
            })}
        </div>
    );
}

export default Inboxes;