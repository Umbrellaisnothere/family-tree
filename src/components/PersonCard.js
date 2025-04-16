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

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImage(imageURL);
        }
    };

    return (
        <div className="person-card">
          <img src={image} alt={person.name} className='person-image'/>
          <div className="person-name">{person.name}</div>
          <div className="person-details"><strong>Gender:</strong> {person.gender || 'Unknown'}</div>
          <div className="person-details"><strong>Relationship:</strong> {person.relationship || 'N/A'}</div>
          <div className="person-details">Born: {person.birthDate}</div>
            {person.deathDate ? (
                <div className="person-details">Died: {person.deathDate}</div>
            ) : (
                <div className="person-details">Age: {calculateAge(person.birthDate)}</div>
            )}
            <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="person-details" />
            <div className="card-actions">
                <button onClick={() => onAddChild(person.id)} className="card-btn">➕ Add Child</button>
                <button onClick={() => onDelete(person.id)} className="card-btn delete">🗑 Delete</button>
            </div>
        </div>
    );
};

export default PersonCard;