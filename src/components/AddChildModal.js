import React, { useState } from "react";
import './AddChildModal.css';

const AddChildModal = ({ parentId, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, birthDate, gender, parent_Id: parentId });
        // onClose();
    };

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <h3>Add Child</h3>
                <form onSubmit={handleSubmit} className='modal-form'>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="date"
                            placeholder="Birth Date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required
                        />
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">♂️ Male</option>
                            <option value="female">♀️ Female</option>
                            <option value="other">⚧️ Other</option>
                        </select>
                        <div className='modal-buttons'>
                            <button type='submit'>Add</button>
                            <button type='button' onClick={onClose}>Cancel</button>
                        </div>
                </form>
            </div>
        </div>
    );
}

export default AddChildModal;