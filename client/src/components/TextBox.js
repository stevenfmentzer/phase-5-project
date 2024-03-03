import React, { useState, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import '../styling/TextBox.css';

function TextBox({ inbox, onSubmit, onHeightChange }) {
    const [formData, setFormData] = useState({
        sender_id: '',
        recipient_id: '',
        message_body: ''
    });

    const [textareaHeight, setTextAreaHeight] = useState(37); // State variable to hold textarea height
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
        adjustTextareaHeight(e.target);
    };

    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = 'auto'; // Reset the height to auto to recalculate the scroll height
        const newHeight = textarea.scrollHeight; // Get the new height
        setTextAreaHeight(newHeight); // Update the state with the new height
        textarea.style.height = `${newHeight}px`; // Set the height to match scrollHeight
    };

    useEffect(() => {
        onHeightChange(textareaHeight);
    }, [textareaHeight, onHeightChange]);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, 'messages', 'POST');
        setTextAreaHeight(37); // Reset the textarea height
    };

    const handleDelaySend = (e) => {
        e.preventDefault();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (formData.message_body.length > 1){
            onSubmit(formData, 'messages', 'POST')
          } else { 
            return
          }
        }
      };

    return (
        <div className="textbox-wrapper">
            <div className='textbox-background-blur'></div>
            <div className="textbox-overlay"></div> {/* Add overlay here */}
            <div className="textbox-container">
                <form onSubmit={handleSubmit}>
                    <div className="textbox-input-container">
                        <textarea
                            rows="1"
                            type="text"
                            name="message_body"
                            placeholder="Message..."
                            value={formData.message_body}
                            onChange={handleChange}
                            autoComplete="off" // Add this line to disable autocomplete
                            onKeyDown={handleKeyDown} // Add this line to handle key events
                        />
                        {formData.message_body.length > 0 && (
                            <div className="button-wrapper" >
                                <button
                                    className="delay-button"
                                    type="submit"
                                    onMouseEnter={() => setHoverDelayButton(true)}
                                    onMouseLeave={() => setHoverDelayButton(false)}
                                >
                                    <Icon
                                        name="clock outline large"
                                        style={{
                                            position: 'relative',
                                            top: '.1px',
                                            right: '.1px',
                                            marginRight: '1px', // Adjust the spacing between icon and button border
                                        }}
                                        onClick={handleDelaySend}
                                    />
                                </button>
                                <button
                                    className="send-button"
                                    type="submit"
                                >
                                    <Icon
                                        name="paper plane large"
                                        style={{
                                            color: 'white',
                                            position: 'relative',
                                            top: '-2.5px', // Adjust the vertical position as needed
                                            marginRight: '3px', // Adjust the spacing between icon and button border
                                            transform: 'rotate(29deg)'
                                        }}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TextBox;