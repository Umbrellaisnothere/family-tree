import React from 'react';
import FamilyTree from './components/FamilyTree';
import './App.css';

const family = [
    {
        id: 1,
        name: 'John Doe',
        birthDate: '01/01/1970',
        image: 'https://randomuser.me/api/portraits',
        children: [
            {
                id: 2,
                name: "Jane Doe",
                birthDate: "1975-08-22",
                image: "https://via.placeholder.com/80",
                children: [
                    {
                        id: 3,
                        name: "Sam Doe",
                        birthDate: "2000-03-10",
                        image: "https://via.placeholder.com/80",
                        children: []
                    }
                ]
            }
        ]
    }
];

function App() {
    return (
        <div className = "min-h-screen bg-gray-200 flex items-center justify-center">
            <FamilyTree family = {family} />
        </div>

    )
}

export default App;
