import React, { useEffect, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import FriendCard from './FriendCard';
import NewFriendForm from './NewFriendForm';
import '../styling/Friends.css';

function Friends({ user }) {
    const [friendships, setFriendships] = useState([]);
    const [selectedFriendship, setSelectedFriendship] = useState([]);
    const [showNewFriendForm, setShowNewFriendForm] = useState(false);
    const [activeFriendList, setActiveFriendList] = useState([])
    const [friendCount, setFriendCount] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:5555/user/${user.id}/friends`)
            .then(response => {
                if (response.ok) {
                    response.json().then(friendshipData => {
                        setFriendships(friendshipData);
                        if (friendshipData.length > 0) {
                            setSelectedFriendship(friendshipData[0]);
                            setFriendCount(activeFriendCount(friendshipData))
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching inbox list:', error);
            });
    }, [user.id]);

    const handleButtonClick = (formData, id, fetchType) => {
        console.log(formData)
        fetch(`http://localhost:5555/friends/${id}`, {
            method: `${fetchType}`,
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
                    console.log(friendshipData)
                    setSelectedFriendship(friendshipData[0]);
                    setFriendCount(activeFriendCount(friendshipData))
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    function activeFriendCount(friendshipData) {
        let friendCount = 0; // Initialize friendCount as a variable, not a constant
        let friendList = []
        friendshipData.forEach(friendship => { // Use forEach instead of map
            if (friendship.is_active) { // Use lowercase "true" instead of "True"
                friendCount += 1;
                friendList.push(friendship)
            }
        });
        setActiveFriendList(friendList)
        return friendCount; // Return the calculated friendCount
    }

    const toggleNewFriendForm = () => {
        setShowNewFriendForm(prevState => !prevState);
    };

    return (
        <div>
            <div className="top-bar" style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between' }}>
                <div className='friend-count-container'>
                    <h3 className='friend-count-text'>Friends </h3>
                    <p className='friend-count'>{friendCount}</p>
                </div>
                <button className="add-friend-button" onClick={toggleNewFriendForm}>
                    <Icon name='user plus' className="icon-add-user" />
                </button>
            </div>
            {showNewFriendForm && <div className="overlay"></div>}
            {showNewFriendForm && <NewFriendForm user={user} friendships={friendships} setFriendships={setFriendships} toggleNewFriendForm={toggleNewFriendForm} handleButtonClick={handleButtonClick} />}
            <div className="friends-grid">
                {activeFriendList.map(friendship => (
                    <FriendCard key={friendship.id} user={user} friendship={friendship} handleButtonClick={handleButtonClick} />
                ))}
            </div>
        </div>
    );
}

export default Friends;