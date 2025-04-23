import React, { useState } from "react";
import './PersonCard.css';

const calculateAge = (birthDate, deathDate) => {
    const birth = new Date(birthDate);
    const death = deathDate ? new Date(deathDate) : new Date();
    let age = death.getFullYear() - birth.getFullYear();
    const month = death.getMonth();
    if (month < birth.getMonth() || (month === birth.getMonth() && death.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

const PersonCard = ({ person, onAddChild, onDelete }) => {
    const [image, setImage] = useState(person.image);
    const [gender, setGender] = useState(person.gender || '');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImage(imageURL);
        }
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    return (
        <div className={`person-card ${gender} ${person.deathDate ? 'deceased' : ''}`}>
            <img src={image} alt={person.name} className='person-image'/>
            <div className="person-name">{person.name}</div>

            {person.deathDate && (
                <div className="person-deceased-note">🕊 Deceased</div>
            )}

            <div className="person-details">
                <strong>Gender:</strong>
                <select value={gender} onChange={handleGenderChange} className="gender-select">
                    <option value="">Unknown</option>
                    <option value="male">♂️ Male</option>
                    <option value="female">♀️ Female</option>
                    <option value="other">⚧️ Other</option>
                </select>
            </div>

            <div className="person-details">
                <strong>Relationship:</strong> {' '}
                {person.relationship && person.relationship.trim() !== '' ? person.relationship : person.isPartner ? 'Partner' : person.children?.length > 0 ? 'Parent' : 'N/A'}
            </div>
            <div className="person-details"><strong>Born:</strong> {person.birthDate}</div>
            {person.deathDate ? (
                <div className="person-details"><strong>Died:</strong> {person.deathDate}</div>
            ) : (
                <div className="person-details"><strong>Age:</strong> {calculateAge(person.birthDate)}</div>
            )}

            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="person-details" 
            />

            <div className="card-actions">
                <button onClick={() => onAddChild(person.id)} className="card-btn">➕ Add Child</button>
                <button onClick={() => onDelete(person.id)} className="card-btn delete">🗑 Delete</button>
            </div>
        </div>
    );
};

export default PersonCard;