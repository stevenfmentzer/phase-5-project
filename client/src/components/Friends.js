import React, { useEffect, useState } from 'react';
import FriendCard from './FriendCard'
import NewFriendForm from './NewFriendForm'
import '../styling/Friends.css'

function Friends({ user }){ 
    const [friendships, setFriendships] = useState([])
    const [selectedFriendship, setSelectedFriendship] = useState([])

    useEffect(() => {
        fetch(`http://localhost:5555/user/${user.id}/friends`)
            .then(response => {
                if (response.ok) {
                    response.json().then(friendshipData => {
                        setFriendships(friendshipData);
                        if (friendshipData.length > 0) {
                            setSelectedFriendship(friendshipData[0]);
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

    return (
        <div>
            <h3>Friends</h3>
            <NewFriendForm user={user} friendships={friendships} setFriendships={setFriendships} />
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