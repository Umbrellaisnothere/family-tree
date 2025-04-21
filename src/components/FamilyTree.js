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
                    const treeData = buildFamilyTree(data.roots);
                    setTree(treeData);
                })
                .catch(err => console.error('Error fetching family:', err));
        }
    }, [isRoot]);

    const addChild = async (parentId) => {
        try {
            const response = await fetch('http://localhost:5000/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parent_Id: parentId,
                    name: "New Child",
                    birthDate: "2023-01-01",
                    image: "https://picsum.photos/80"
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
        const hasPartner = person.partner !== null && person.partner !== undefined;
        const hasChildren = person.children && person.children.length > 0;
        const hasParent = person.parent !== null && person.parent !== undefined;

        return (
            <div 
            className='family-node-stack' 
            key={person.id}>
                {hasParent && (
                    <div className='family-parent'>
                        <FamilyTree family={[person.parent]} isRoot={false} />
                    </div>
                )}

            <div 
            key={person.id} 
            className={`family-node-wrapper ${hasChildren ? 'has-children' : ''}`}
            >
                <div className={`partner-group ${hasPartner ? 'with-partner' : 'single-parent'}`}>
                    <PersonCard
                        person={person}
                        onAddChild={addChild}
                        onDelete={deletePerson}
                    />
                    {hasPartner && (
                        <PersonCard
                            person={person.partner}
                            isPartner
                            onDelete={deletePerson}
                        />
                    )}
                </div>

                {hasChildren && (
                    <div className="family-children">
                        {person.children.map((child) => (
                            <div key={child.id} 
                            className='child-node'>
                                <FamilyTree family={[child]} isRoot={false} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
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