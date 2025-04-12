import React, { useState } from "react";
import './PersonCard.css';

const calculateAge = (birthDate, deathDate) => {
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    if (end.getMonth() < birth.getMonth() || (end.getMonth() === birth.getMonth() && end.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

const PersonCard = ({ person }) => {
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
          <img src={image} alt={person.name} />
          <div>
            <h2>{person.name}</h2>
            <p>Born: {person.birthDate}</p>
            {person.deathDate ? (
              <p className="death">Died: {person.deathDate}</p>
            ) : (
              <p className="age">Age: {calculateAge(person.birthDate, person.deathDate)}</p>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>
      );
    };

export default PersonCard;