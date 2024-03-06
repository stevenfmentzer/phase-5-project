import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'semantic-ui-react';
import '../styling/TextBox.css';
import DelayForm from './DelayForm';

function TextBox({ inbox, onSubmit, onHeightChange, showDelayForm, setShowDelayForm }) {
    const [formData, setFormData] = useState({
        sender_id: '',
        recipient_id: '',
        message_body: '',
        delivery_time: ''
    });
    const [textareaHeight, setTextAreaHeight] = useState(37);
    const textBoxRef = useRef(null);

    useEffect(() => {
        if (inbox && inbox.length > 0) {
            const currentInboxId = `${inbox[0].user_id}${inbox[0].contact_user_id}`;
            const previousInboxId = `${formData.sender_id}${formData.recipient_id}`;
            
            if (currentInboxId !== previousInboxId) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    sender_id: `${inbox[0].user_id}`,
                    recipient_id: `${inbox[0].contact_user_id}`,
                    message_body: '',
                    delivery_time: ''
                }));
            }
        }
    }, [inbox, formData, setFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        adjustTextareaHeight(e.target);
    };

    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = 'auto';
        const newHeight = textarea.scrollHeight;
        setTextAreaHeight(newHeight);
        textarea.style.height = `${newHeight}px`;
    };

    useEffect(() => {
        onHeightChange(textareaHeight);
    }, [textareaHeight, onHeightChange]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, 'messages', 'POST');
        setFormData(prevFormData => ({
            ...prevFormData,
            message_body: '' // Clear the message body after submission
        }));
        setTextAreaHeight(37);
        setShowDelayForm(false);
    };

    const handleDelaySettings = (e) => {
        e.preventDefault();
        setShowDelayForm(!showDelayForm);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (formData.message_body.length > 1) {
                setTextAreaHeight(37);
                setShowDelayForm(false);
                onSubmit(formData, 'messages', 'POST');
                setFormData(prevFormData => ({
                    ...prevFormData,
                    message_body: '' // Clear the message body after submission
                }));
            }
        }
    };

    return (
        <div>
            {showDelayForm && 
            <DelayForm 
                formData={formData} 
                setFormData={setFormData} 
                onSubmit={handleSubmit}
                setShowDelayForm={setShowDelayForm}
                textBoxRef={textBoxRef} 
            />}
            <div className="textbox-wrapper" ref={textBoxRef}>
                <div className='textbox-background-blur'></div>
                <div className="textbox-overlay"></div> 
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
                                autoComplete="off" 
                                onKeyDown={handleKeyDown} 
                            />
                            {formData.message_body.length > 0 && (
                                <div className="button-wrapper" >
                                    <button
                                        className="delay-button"
                                        type="button" 
                                        onClick={handleDelaySettings}
                                    >
                                    <Icon
                                        name="clock outline large"
                                        className={`clock-icon-styling-${showDelayForm ? "clock-icon-blue" : ""}`}
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
                                                top: '-2.5px', 
                                                marginRight: '3px', 
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
        </div>
    );
}

export default TextBox;