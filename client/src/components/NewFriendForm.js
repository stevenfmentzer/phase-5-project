import React, { useState } from 'react';
import '../styling/NewFriendForm.css'; // Import CSS file

function NewFriendForm({ user, friendships, setFriendships, toggleNewFriendForm, handleButtonClick }) {
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

    const handleAddFriendship = () => {
        console.log("click")
        console.log(foundUser)
        if (foundUser) {
            console.log("in function")
            const formData={
                user1_id: user.id,
                user2_id: foundUser.id
            }
            console.log(`Form Data: ${formData.user1_id}, ${formData.user2_id}`)
            setFoundUser(null);
            handleButtonClick(formData, '', 'POST')
        }
    };

    return (
        <div className="login-container"> {/* Apply the login-container class */}
            <h3>Add New Friend</h3>
            <button className="close-button" onClick={toggleNewFriendForm}>x</button>
            <form onSubmit={handleSubmit}>
                <div className="login-input-container"> {/* Apply the input-container class */}
                    <input
                        type="number"
                        name="phone_number"
                        placeholder="Search"
                        value={phoneNumber}
                        onChange={handleChange}
                        inputMode="numeric"
                        min="0"
                    />
                </div>
                <button className="search-button" type="submit">
                    Search
                </button>
            </form>
            {foundUser && (
                <div>
                    <h4>User Found:</h4>
                    <p>Name: {`${foundUser.first_name} ${foundUser.last_name}`}</p>
                    <button className="add-friend-button" onClick={handleAddFriendship}>
                        Add
                    </button>
                </div>
            )}
        </div>
    );
}

export default NewFriendForm;