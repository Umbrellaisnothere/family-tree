import React, { useState, useEffect } from "react";
import { buildFamilyTree } from "../utilities/buildFamilyTree";
import PersonCard from "./PersonCard";
import "./FamilyTree.css";

const FamilyTree = ({ isRoot = true }) => {
    const [tree, setTree] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/family')
            .then(res => res.json())
            .then(data => {
                const treeData =buildFamilyTree(data);
                setTree(treeData);
            })
            .catch(err => console.error('Error fetching family:', err));
    }, []);

    const addChild = async (parentId) => {
        try {
            const response = await fetch('http://localhost:5000/api/family', {
                method: 'POST',
                headers: {
                 'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                parent_Id: parentId,
                name: "New Child",
                birthDate: "2023-01-01",
                image: "https://picsum.photos/80",
            }),
        });

        if (!response.ok) throw new Error('Failed to add child');

        const newChild = await response.json();

        const updateTree = (nodes) => 
            nodes.map(node => {
                if (node.id === parentId) {
                    return { ...node, children: [...node.children, newChild] };
                } 
                return { ...node, children: updateTree(node.children || []) };
            });

        setTree(updateTree(tree));
        } catch (error) {
            console.error('Error adding child:', error);
        }
    };
        
        const deletePerson = async (idToDelete) => {
            try {
                const res = await fetch(`http://localhost:5000/api/family/${idToDelete}`, {
                    method: 'DELETE',
                });
                if (!res.ok) throw new Error('Failed to delete person');
                
                const updated = await fetch('http://localhost:5000/api/family');
                const data = await updated.json();
                setTree(buildFamilyTree(data));
            } catch (error) {
                console.error('Error deleting person:', error);
            }

            const removeNode = (nodes) => 
                nodes
            .filter(node => node.id !== idToDelete)
            .map(node => ({
                ...node,
                children: removeNode(node.children || [])}));
                
        setTree(removeNode(tree));
    }

    return (
        <div className="family-tree-container">
    {isRoot && <h1 className="family-tree-header">Ancestral Tree</h1>}
    <div className="family-tree">
        {Array.isArray(tree) && tree.length > 0 ? (tree.map((person) => (
            <div key={person.id} className="family-node">
                <PersonCard person={person} 
                onAddChild={() => addChild(person.id)}
                onDelete={() => deletePerson(person.id)}/>

                {person.children && person.children.length > 0 && (
                    <div className="family-children">
                        {person.children.map((child) => (
                            <div key={child.id}>
                                <FamilyTree family={[child]} isRoot={false} />
                            </div>
                ))}
                </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No data available</p>
            )}
        </div>
    </div>
    );
};

export default FamilyTree;