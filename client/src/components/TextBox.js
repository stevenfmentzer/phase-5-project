import React, { useState, useEffect } from 'react';
import { Card, Icon } from 'semantic-ui-react';
import '../styling/TextBox.css';

function TextBox({ inbox, onSubmit }) {
    const [formData, setFormData] = useState({
        sender_id: '',
        recipient_id: '',
        message_body: ''
    });

    const [isHovering, setIsHovering] = useState(false);
    const [hoverDelayButton, setHoverDelayButton] = useState(false);

    useEffect(() => {
        // Reset formData when inbox changes
        if (inbox && inbox.length > 0) {
            setFormData({
                sender_id: `${inbox[0].user_id}`,
                recipient_id: `${inbox[0].contact_user_id}`,
                message_body: ""
            });
        }
    }, [inbox]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, 'messages', 'POST')
    }

    const handleDelaySend = (e) => {

        e.preventDefault();
    }

    return (
        <div className="textbox-wrapper">
            <div className='textbox-background-blur'></div>
            <div className="textbox-overlay"></div> {/* Add overlay here */}
            <div className="textbox-container">
                <form onSubmit={handleSubmit}>
                    <div className="textbox-input-container">
                        <input
                            type="text"
                            name="message_body"
                            placeholder="Message"
                            value={formData.message_body}
                            onChange={handleChange}
                            autoComplete="off" // Add this line to disable autocomplete
                        />
                        {formData.message_body.length > 0 && (
                            <div
                                className="button-wrapper"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <button
                                    className="send-button"
                                    type="submit"
                                >
                                    <Icon
                                        name="arrow up"
                                        style={{
                                            color: 'lightgrey',
                                            position: 'relative',
                                            top: '-1px', // Adjust the vertical position as needed
                                            marginRight: '1px', // Adjust the spacing between icon and button border
                                        }}
                                    />
                                </button>
                                {isHovering && (
                                  <button
                                      className="delay-button"
                                      type="submit"
                                      onMouseEnter={() => setHoverDelayButton(true)}
                                      onMouseLeave={() => setHoverDelayButton(false)}
                                  >
                                      <Icon
                                          name="clock outline large"
                                          style={{
                                              color: hoverDelayButton ? 'grey' : 'lightgrey',
                                              position: 'relative',
                                              top: '.1cpx',
                                              right: '.1px',
                                              marginRight: '1px', // Adjust the spacing between icon and button border
                                          }}
                                          onClick={handleDelaySend}
                                      />
                                  </button>
                              )}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TextBox;