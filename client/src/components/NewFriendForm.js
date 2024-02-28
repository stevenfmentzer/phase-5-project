import React, { useState } from 'react';

function NewFriendForm({ user, friendships, setFriendships }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [foundUser, setFoundUser] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Perform fetch only if phoneNumber is not empty
        if (phoneNumber) {
            try {
                const response = await fetch(`http://localhost:5555/search/${phoneNumber}`);
                if (response.ok) {
                    const user = await response.json();
                    setFoundUser(user);
                } else {
                    setFoundUser(null); // Reset foundUser if no user is found
                }
            } catch (error) {
                console.error('Error searching for user:', error);
            }
        } else {
            setFoundUser(null); // Reset foundUser if phoneNumber is empty
        }
    };

    const handleChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleAddFriendship = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Perform fetch only if phoneNumber is not empty
        if (foundUser) {
            try {
                const response = await fetch(`http://localhost:5555/friends`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user1_id: user.id,
                        user2_id: foundUser.id
                    }),
                });
                if (response.ok) {
                    const friendship = await response.json();
                    setFriendships([...friendships, friendship]);
                } else {
                    console.error('Error adding friendship:', response.statusText);
                }
            } catch (error) {
                console.error('Error adding friendship:', error);
            }
        } else {
            setFoundUser(null); // Reset foundUser if phoneNumber is empty
        }
    };

    return (
        <div>
            <h3>NEW FRIEND FORM</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="phone_number"
                    placeholder="Search"
                    value={phoneNumber}
                    onChange={handleChange}
                    inputMode="numeric"
                    min="0"
                />
                <button type="submit">Search</button>
            </form>
            {foundUser && (
                <div>
                    <h4>User Found:</h4>
                    <p>Name: {`${foundUser.first_name} ${foundUser.last_name}`}</p>
                    <button onClick={handleAddFriendship}>Add</button>
                </div>
            )}
        </div>
    );
}

export default NewFriendForm;