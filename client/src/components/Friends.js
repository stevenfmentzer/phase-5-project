import React, { useEffect, useState } from 'react';
import FriendCard from './FriendCard';
import NewFriendForm from './NewFriendForm';
import '../styling/Friends.css';

function Friends({ user }) {
    const [friendships, setFriendships] = useState([]);
    const [selectedFriendship, setSelectedFriendship] = useState([]);
    const [showNewFriendForm, setShowNewFriendForm] = useState(false);
    const [friendCount, setFriendCount] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:5555/user/${user.id}/friends`)
            .then(response => {
                if (response.ok) {
                    response.json().then(friendshipData => {
                        setFriendships(friendshipData);
                        if (friendshipData.length > 0) {
                            setSelectedFriendship(friendshipData[0]);
                            setFriendCount(friendshipData.length)
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching inbox list:', error);
            });
    }, [user.id]);

    const handleButtonClick = (formData, id) => {
        fetch(`http://localhost:5555/friends/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(textBoxResponse => {
                if (textBoxResponse.ok) {
                    return textBoxResponse.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(textBoxData => {
                // After successful PATCH, fetch Friendships again
                return fetch(`http://localhost:5555/user/${user.id}/friends`);
            })
            .then(getResponse => {
                if (getResponse.ok) {
                    return getResponse.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(friendshipData => {
                setFriendships(friendshipData);
                if (friendshipData.length > 0) {
                    setSelectedFriendship(friendshipData[0]);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const toggleNewFriendForm = () => {
        setShowNewFriendForm(prevState => !prevState);
    };

    return (
        <div>
            <div className="top-bar" style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between' }}>
                <h3>Friends ({friendCount})</h3>
                <button className="add-friend-button" onClick={toggleNewFriendForm}>
                    Add Friend
                </button>
            </div>
            {showNewFriendForm && <div className="overlay"></div>}
            {showNewFriendForm && <NewFriendForm user={user} friendships={friendships} setFriendships={setFriendships} onClick={toggleNewFriendForm} />}
            <div className="friends-grid">
                {friendships.map(friendship => (
                    friendship.is_active ? (
                        <FriendCard key={friendship.id} user={user} friendship={friendship} handleButtonClick={handleButtonClick} />
                    ) : null
                ))}
            </div>
        </div>
    );
}

export default Friends;