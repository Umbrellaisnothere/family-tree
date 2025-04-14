import React, { useState, useEffect } from "react";
import { buildFamilyTree } from "../utilities/buildFamilyTree";
import PersonCard from "./PersonCard";
import "./FamilyTree.css";

const FamilyTree = ({ family = [], isRoot = true }) => {
    const [tree, setTree] = useState([]);

    useEffect(() => {
        if (isRoot) {
            fetch('http://localhost:5000/api/family')
                .then(res => res.json())
                .then(data => {
                    const treeData = buildFamilyTree(data);
                    setTree(treeData);
                })
                .catch(err => console.error('Error fetching family:', err));
            }
    }, [isRoot]);

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
            nodes.map((node) =>
                node.id === parentId
                    ? { ...node, children: [...(node.children || []), newChild] }  
                    : { ...node, children: updateTree(node.children || []) }
            );

        setTree(updateTree(tree));
        } catch (err) {
            console.error(err);
        }
    };
        
        const deletePerson = async (idToDelete) => {
            try {
                await fetch(`http://localhost:5000/api/family/${idToDelete}`, {
                    method: 'DELETE',
                });
                
                const updated = await fetch('http://localhost:5000/api/family');
                const data = await updated.json();
                setTree(buildFamilyTree(data));
            } catch (error) {
                console.error('Error deleting person:', error);
            }
    };

    const renderNode = (person) => {
        return (
            <div key={person.id} className="family-node-wrapper">
                <div className="partner-group">
                    <PersonCard
                        person={person}
                        onAddChild={() => addChild(person.id)}
                        onDelete={() => deletePerson(person.id)}
                    />
                    {person.partner && (
                        <PersonCard
                            person={person.partner}
                            isPartner
                            onDelete={() => deletePerson(person.partner.id)}
                        />
                    )}
                </div>

                {person.children && person.children.length > 0 && (
                    <div className="family-children">
                        {person.children.map((child) => (
                            <FamilyTree key={child.id} family={[child]} isRoot={false} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="family-tree-container">
            {isRoot && <h1 className="family-tree-header">Ancestral Tree</h1>}
            <div className="family-tree">
                {(isRoot ? tree : family).map((person) => renderNode(person))}
            </div>
        </div>
    );
};

export default FamilyTree;