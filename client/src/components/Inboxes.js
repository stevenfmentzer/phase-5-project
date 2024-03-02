import React from 'react';
import InboxCard from './InboxCard';
import '../styling/Inbox.css';

function Inboxes({ inboxes, onClick }) {

    return (
        <div className="inbox">
            {inboxes.map(( inboxArray, index ) => {
                const inboxData = inboxArray[0]; // Accessing the inbox data from the first element
                return (
                    <div className="card-container" key={inboxData.inbox_id} onClick={() => onClick(index)}>
                        <InboxCard inboxData={inboxData} />
                    </div>
                );
            })}
        </div>
    );
}

export default Inboxes;