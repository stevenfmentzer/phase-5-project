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
    const [friendCount, setFriendCount] = useState(0)
    const [closeFriendCount, setCloseFriendCount] = useState(0)

    useEffect(() => {
        fetch(`http://localhost:5555/user/${user.id}/friends`)
            .then(response => {
                if (response.ok) {
                    response.json().then(friendshipData => {
                        setFriendships(friendshipData);
                        if (friendshipData.length > 0) {
                            setSelectedFriendship(friendshipData[0]);
                            activeFriendCount(friendshipData)
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
                    activeFriendCount(friendshipData)
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    function activeFriendCount(friendshipData) {
        let checkFriendCount = 0;
        let checkCloseFriendCount = 0;
        let friendList = [];
    
        friendshipData.forEach(friendship => {
            if (friendship.is_active) {
                checkFriendCount += 1;
                friendList.push(friendship);
    
                if (friendship.user1_id == user.id && friendship.is_close_friend_user1 == true || friendship.user2_id == user.id && friendship.is_close_friend_user2 === true) {
                    checkCloseFriendCount += 1;
                }
            }
        });
    
        setActiveFriendList(friendList);
        setCloseFriendCount(checkCloseFriendCount);
        setFriendCount(checkFriendCount);
    }

    const toggleNewFriendForm = () => {
        setShowNewFriendForm(prevState => !prevState);
    };

    return (
        <div>
            <div className="top-bar">
                <div className='friend-count-container'>
                    <h3 className='friend-count-text'>Friends </h3>
                    <p className='friend-count'>{friendCount}</p>
                    <h3 className='close-friend-count-text'>Close Friends </h3>
                    <p className='close-friend-count'>{closeFriendCount}</p>
                </div>
                <button className="add-friend-button" onClick={toggleNewFriendForm}>
                    <Icon name='user plus' className="icon-add-user" />
                </button>
            </div>
            {showNewFriendForm && <NewFriendForm user={user} friendships={friendships} setFriendships={setFriendships} toggleNewFriendForm={toggleNewFriendForm} handleButtonClick={handleButtonClick} />}
            {showNewFriendForm && <div className="overlay"></div>}
            <div>
            <div className="friends-grid">
                {activeFriendList.map(friendship => (
                    <FriendCard key={friendship.id} user={user} friendship={friendship} handleButtonClick={handleButtonClick} />
                ))}
            </div>
            </div>
        </div>
    );
}

export default Friends;