import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { buildFamilyTree } from '../utilities/buildFamilyTree';
import PersonCard from './PersonCard';
import AddChildModal from './AddChildModal';
import './FamilyTree.css';

const FamilyTree = ({ family = [], isRoot = true }) => {
    const [allPersons, setAllPersons] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [expanded, setExpanded] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalParentId, setModalParentId] = useState(null);

    useEffect(() => {
        if (isRoot) {
            fetch('http://localhost:5000/api/family')
                .then(res => res.json())
                .then(data => {
                    const treeData = buildFamilyTree(data.persons || [], data.relationships || []);
                    const autoExpanded = {};
                    const traverse = (node) => {
                        autoExpanded[String(node.id)] = true;
                        node.children?.forEach(traverse);
                    };
                    treeData.forEach(traverse);
                    setExpanded(autoExpanded);
                    setAllPersons(data.persons || []);
                    setRelationships(data.relationships || []);
                })
                .catch(err => console.error('Error fetching family:', err));
        }
    }, [isRoot]);

    const openAddChildModal = useCallback((parentId) => {
        setModalParentId(parentId);
        setShowModal(true);
    }, []);

    const handleAddChildSubmit = async (childData) => {
        const newChild = {
            ...childData,
            parentId: modalParentId,
            children: [],
            deathDate: null,
            image: null
        };

        try {
            const response = await fetch('http://localhost:5000/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newChild),
            });

            if (!response.ok) throw new Error('Failed to add child');

            const updated = await fetch('http://localhost:5000/api/family');
            const data = await updated.json();
            if (data.error) {
                alert('API error: ' + data.error);
                return;
            }
            preserveExpandedState(buildFamilyTree(data.persons || [], data.relationships || []));
            setAllPersons(data.persons || []);
            setRelationships(data.relationships || []);
            setExpanded(prev => ({ ...prev, [String(modalParentId)]: true }));
            setShowModal(false);
        } catch (err) {
            alert('Something went wrong. Please try again later.')
            console.error(err);
        }
    };

    const preserveExpandedState = useCallback((newTree) => {
        const newExpanded = {};
        const traverse = (node) => {
            if (!node) return;
            newExpanded[String(node.id)] = expanded[String(node.id)] || false;
            node.children?.forEach(traverse);
        };
        newTree.forEach(traverse);
        setExpanded(newExpanded);
    }, [expanded]);

    const deletePerson = useCallback(async (idToDelete, parentId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/family/${idToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete person');

            const updated = await fetch('http://localhost:5000/api/family');
            const data = await updated.json();
            if (data.error) {
                alert('API error: ' + data.error);
                return;
            }
            preserveExpandedState(buildFamilyTree(data.persons || [], data.relationships || []));
            setAllPersons(data.persons || []);
            setRelationships(data.relationships || []);

            setTimeout(() => {
                if (parentId) {
                    const el = document.getElementById(`person-${parentId}`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }, 300);
        } catch (error) {
            console.error('Error deleting person:', error);
        }
    }, [preserveExpandedState]);

    const toggleExpand = useCallback((personId) => {
        setExpanded((prevExpanded) => ({ ...prevExpanded, [String(personId)]: !prevExpanded[String(personId)] }));
    }, []);

    const expandToPerson = (personId) => {
        const personMap = new Map(allPersons.map(p => [p.id, p]));
        let current = personMap.get(personId);
        if (!current) return;

        const path = [];
        while (current?.parentId) {
            path.push(String(current.parentId));
            current = personMap.get(current.parentId);
        }

        const newExpanded = { ...expanded };
        path.forEach(pid => newExpanded[pid] = true);
        setExpanded(newExpanded);
    };

    const renderNode = useCallback((person) => {
        const children = Array.isArray(person.children) ? person.children : [];
        const hasPartner = !!person.partner;
        const hasChildren = children.length > 0;
        const isExpanded = expanded[String(person.id)] ?? false;

        return (
            <div className='tree-node' key={person.id} style={{ position: 'relative' }}>
                <div className='tree-partners'>
                        <PersonCard
                            person={person}
                        onAddChild={openAddChildModal}
                        onDelete={deletePerson}
                        />
                        {hasPartner && (
                        <div className='partner-connector-wrapper'>
                            <div className='partner-line'></div>
                                <div className='partner-connector'>❤️</div>
                        </div>
                    )}
                    {hasPartner && (
                                <PersonCard
                                    person={person.partner}
                                    isPartner
                            onDelete={deletePerson}
                        />
                    )}
                </div>
                {hasChildren && isExpanded && (
                    <svg
                        className='tree-connector-svg'
                        width='100%'
                        height='70'
                        style={{ position: 'absolute', left: 0, right: 0, top: 'calc(100% - 10px)', pointerEvents: 'none', zIndex: 1 }}
                    >
                        <defs>
                            <linearGradient id='connector-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                                <stop offset='0%' stopColor='#60a5fa' />
                                <stop offset='100%' stopColor='#818cf8' />
                            </linearGradient>
                            <filter id='connector-shadow' x='-20%' y='-20%' width='140%' height='140%'>
                                <feDropShadow dx='0' dy='2' stdDeviation='2' floodColor='#60a5fa' floodOpacity='0.18' />
                            </filter>
                        </defs>
                        {children.map((child, idx) => {
                            const childCount = children.length;
                            const spacing = 100 / (childCount + 1);
                            const childX = spacing * (idx + 1);
                            return (
                                <path
                                    key={child.id}
                                    d={`M50 10 C50 40, ${childX} 20, ${childX} 70`}
                                    stroke='url(#connector-gradient)'
                                    strokeWidth='4'
                                    fill='none'
                                    filter='url(#connector-shadow)'
                                    opacity='0.95'
                                />
                            );
                        })}
                    </svg>
                )}
                    {hasChildren && (
                    <button onClick={() => toggleExpand(person.id)} className='collapse-toggle mt-2'>
                            {isExpanded ? 'Collapse Children' : 'Expand Children'}
                        </button>
                    )}
                {isExpanded && hasChildren && (
                    <div className='tree-children'>
                        {children.map(child => (
                            <div className='tree-child' key={child.id}>
                                {renderNode(child)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }, [expanded, openAddChildModal, deletePerson, toggleExpand]);

    const tree = useMemo(() => buildFamilyTree(allPersons, relationships), [allPersons, relationships]);

    const partnerIds = useMemo(() => {
        const ids = new Set();
        allPersons.forEach(person => {
            if (person.partnerId) ids.add(person.partnerId);
        });
        return ids;
    }, [allPersons]);

    return (
        <div className='family-tree-container'>
            {isRoot && <h1 className='family-tree-header'>Ancestral Tree</h1>}

            <input
                type='text'
                placeholder='Search family member...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-history'
            />

            {searchQuery && (
                <ul className='search-results-list'>
                    {allPersons.filter((person) =>
                        person.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((person) => (
                        <li
                            key={person.id}
                            className='search-result-item'
                            onClick={() => {
                                setSearchQuery('');
                                expandToPerson(person.id);

                                const el = document.getElementById(`person-${person.id}`);
                                if (el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    el.classList.add('highlight');
                                    setTimeout(() => el.classList.remove('highlight'), 2000);
                                }
                            }}
                        >
                            👤 {person.name}
                        </li>
                    ))
                    }

                    {allPersons.filter(person =>
                        person.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                            <li className='search-no-result'>❌  Person not found</li>
                        )}
                </ul>
            )}

            {(tree.length === 0 && isRoot) ? (
                <div className="loading-tree">Loading family tree...</div>
            ) : (
                <div className='family-tree'>
                    {(tree.length > 0 ? tree : family)
                        .filter(person => !partnerIds.has(person.id))
                        .map((person) => renderNode(person))}
                </div>
            )}

            {showModal && (
                <AddChildModal
                    parentId={modalParentId}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAddChildSubmit}
                />
            )}
        </div>
    );
};

export default FamilyTree;