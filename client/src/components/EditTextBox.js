import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'semantic-ui-react';
import '../styling/TextBox.css';

function EditTextBox({ onSubmit, editMessage, setEditMessage, onHeightChange, setIsEditMode }) {
    const [formData, setFormData] = useState({
        message_body: ''
    });

    const [textareaHeight, setTextAreaHeight] = useState(37); // State variable to hold textarea height
    const textareaRef = useRef(null);

    useEffect(() => {
        setFormData({ message_body: editMessage.message_body });
    }, [editMessage]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = formData.message_body.length;
            adjustTextareaHeight(textareaRef.current);
        }
    }, [formData.message_body, editMessage]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        onSubmit(formData, `message/${editMessage.id}`, 'PATCH');
        handleCloseEdit();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (formData.message_body.length > 1) {
                onSubmit(formData, `message/${editMessage.id}`, 'PATCH');
            }
            handleCloseEdit();
        }
    };

    const handleCloseEdit = (e) => {
        onHeightChange(37);
        setEditMessage([]);
        setIsEditMode(false); // Set isEditMode to false to switch back to the normal TextBox
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
                            autoFocus={true}
                            ref={textareaRef}
                            name="message_body"
                            value={formData.message_body}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            autoComplete="off"
                            style={{ height: '100%' }}
                        />
                        {formData.message_body.length > 0 && (
                            <div className="button-wrapper" >
                                <button className="close-edit-button"
                                    onClick={handleCloseEdit}
                                    type="submit"
                                >
                                  <Icon
                                      name="times"
                                      style={{
                                          position: 'relative',
                                          top: '2px',
                                          right: '1.5px',
                                          marginRight: '1px', // Adjust the spacing between icon and button border
                                      }}
                                  />
                                </button>
                                <button
                                    className="send-button"
                                    type="submit"
                                >
                                    <Icon
                                        name="check large"
                                        className='confirm-edit-icon'
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

export default EditTextBox;