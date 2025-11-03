import React, { useState, useRef, useEffect } from 'react';
import { MapData, Character, PlacedCharacter } from '../types';
import { fileToBase64 } from '../App';
import { BackArrowIcon, PencilIcon, CheckIcon, PlusIcon, TrashIcon, CloseIcon } from './icons';
import EditableField from './EditableField';

interface MapViewProps {
    mapData: MapData;
    characters: Character[];
    onMapDataChange: (newMapData: MapData) => void;
    onStartChat: (character: Character) => void;
    onBack: () => void;
    onGenerateActivity: (character: Character) => Promise<string>;
}

interface CharacterActionPopupProps {
    character: Character;
    position: { x: number, y: number };
    onStartChat: () => void;
    onGenerateActivity: () => Promise<string>;
    onClose: () => void;
}

const CharacterActionPopup: React.FC<CharacterActionPopupProps> = ({ character, position, onStartChat, onGenerateActivity, onClose }) => {
    const [activity, setActivity] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    const handleGenerateClick = async () => {
        setIsGenerating(true);
        setActivity('');
        const generatedActivity = await onGenerateActivity();
        setActivity(generatedActivity);
        setIsGenerating(false);
    };
    
    // Close popup if clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div 
            ref={popupRef}
            className="absolute z-30 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 w-64 transform -translate-x-1/2"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
        >
            <h3 className="font-bold text-lg text-center mb-2">{character.name}</h3>
            <div className="space-y-2">
                <button 
                    onClick={onStartChat} 
                    className="w-full text-center p-2 rounded-md font-semibold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors"
                >
                    Nói chuyện
                </button>
                <div className="bg-gray-800 p-2 rounded-md">
                     <button 
                        onClick={handleGenerateClick}
                        disabled={isGenerating}
                        className="w-full text-center p-2 rounded-md font-semibold bg-cyan-600 hover:bg-cyan-500 transition-colors disabled:bg-gray-600"
                    >
                        {isGenerating ? 'Đang nghĩ...' : 'Tên hoạt động'}
                    </button>
                    {activity && (
                        <p className="text-center text-sm text-gray-300 mt-2 p-2 bg-black/30 rounded">{activity}</p>
                    )}
                </div>
            </div>
        </div>
    );
};


const MapView: React.FC<MapViewProps> = ({ mapData, characters, onMapDataChange, onStartChat, onBack, onGenerateActivity }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draggingChar, setDraggingChar] = useState<string | null>(null);
    const [selectedPopupChar, setSelectedPopupChar] = useState<PlacedCharacter | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    const handleFieldChange = <K extends keyof MapData>(field: K, value: MapData[K]) => {
        onMapDataChange({ ...mapData, [field]: value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            handleFieldChange('imageUrl', base64);
        }
    };
    
    const addCharacterToMap = (characterId: string) => {
        if (mapData.placedCharacters.some(pc => pc.characterId === characterId)) return;
        const newPlacedChar: PlacedCharacter = { characterId, x: 50, y: 50 };
        handleFieldChange('placedCharacters', [...mapData.placedCharacters, newPlacedChar]);
    };
    
    const removeCharacterFromMap = (characterId: string) => {
        handleFieldChange('placedCharacters', mapData.placedCharacters.filter(pc => pc.characterId !== characterId));
    };

    const handleMouseDown = (characterId: string) => {
        if (isEditing) {
            setDraggingChar(characterId);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!draggingChar || !mapRef.current) return;
        const mapRect = mapRef.current.getBoundingClientRect();
        const x = ((e.clientX - mapRect.left) / mapRect.width) * 100;
        const y = ((e.clientY - mapRect.top) / mapRect.height) * 100;
        
        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));

        const updatedChars = mapData.placedCharacters.map(pc => 
            pc.characterId === draggingChar ? { ...pc, x: clampedX, y: clampedY } : pc
        );
        handleFieldChange('placedCharacters', updatedChars);
    };

    const handleMouseUp = () => {
        setDraggingChar(null);
    };
    
    const unplacedCharacters = characters.filter(
        c => !mapData.placedCharacters.some(pc => pc.characterId === c.id)
    );

    return (
        <div className="flex flex-col h-full bg-black text-white">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-black/50 backdrop-blur-sm z-20">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800">
                    <BackArrowIcon className="w-6 h-6"/>
                </button>
                <EditableField value={mapData.name} onSave={(val) => handleFieldChange('name', String(val))}>
                   <h1 className="text-xl font-bold">{mapData.name}</h1>
                </EditableField>
                <button onClick={() => setIsEditing(!isEditing)} className="p-2 rounded-full hover:bg-gray-800">
                    {isEditing ? <CheckIcon className="w-6 h-6 text-green-400" /> : <PencilIcon className="w-6 h-6"/>}
                </button>
            </header>

            <main 
                ref={mapRef}
                className="flex-grow relative overflow-hidden" 
                onMouseMove={handleMouseMove} 
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves map area
            >
                {mapData.imageUrl && (
                    <img src={mapData.imageUrl} alt="Map Background" className="absolute inset-0 w-full h-full object-cover" />
                )}
                
                {mapData.placedCharacters.map(pc => {
                    const character = characters.find(c => c.id === pc.characterId);
                    if (!character) return null;
                    return (
                        <div
                            key={pc.characterId}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${isEditing ? 'cursor-grab' : 'cursor-pointer'} group`}
                            style={{ left: `${pc.x}%`, top: `${pc.y}%`, zIndex: 10 }}
                            onMouseDown={() => handleMouseDown(pc.characterId)}
                             onClick={() => !isEditing && setSelectedPopupChar(pc)}
                        >
                            <img 
                                src={character.imageUrl} 
                                alt={character.name} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
                                onDragStart={(e) => e.preventDefault()} // Prevent native image dragging
                            />
                             <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/70 px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                {character.name}
                            </div>
                            {isEditing && (
                                <button 
                                    onClick={() => removeCharacterFromMap(pc.characterId)} 
                                    className="absolute -top-1 -right-1 p-0.5 bg-red-600 rounded-full text-white"
                                >
                                    <CloseIcon className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    );
                })}
                
                {selectedPopupChar && (
                    <CharacterActionPopup 
                        character={characters.find(c => c.id === selectedPopupChar.characterId)!}
                        position={{ x: selectedPopupChar.x, y: selectedPopupChar.y + 6 /* Offset below avatar */ }}
                        onStartChat={() => {
                            const char = characters.find(c => c.id === selectedPopupChar.characterId);
                            if (char) onStartChat(char);
                        }}
                        onGenerateActivity={() => onGenerateActivity(characters.find(c => c.id === selectedPopupChar.characterId)!)}
                        onClose={() => setSelectedPopupChar(null)}
                    />
                )}

                {isEditing && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 z-20 space-y-4">
                        <div className="bg-gray-800/80 p-3 rounded-lg">
                            <h3 className="font-semibold mb-2">Chỉnh sửa Bản đồ</h3>
                            <EditableField value={mapData.description} onSave={(val) => handleFieldChange('description', String(val))} inputType="textarea">
                                <p className="text-sm text-gray-300">{mapData.description || 'Click để thêm mô tả...'}</p>
                            </EditableField>
                            <label className="block w-full text-center mt-2 text-sm cursor-pointer text-yellow-400 p-2 bg-gray-700 rounded-md hover:bg-gray-600">
                                Tải Lên Ảnh Bản Đồ Mới
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
                            </label>
                        </div>
                         <div className="bg-gray-800/80 p-3 rounded-lg">
                             <h3 className="font-semibold mb-2">Thêm Nhân Vật</h3>
                            <div className="flex flex-wrap gap-2">
                                {unplacedCharacters.length > 0 ? unplacedCharacters.map(char => (
                                    <button 
                                        key={char.id}
                                        onClick={() => addCharacterToMap(char.id)}
                                        className="flex items-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        <span>{char.name}</span>
                                    </button>
                                )) : <p className="text-xs text-gray-400">Tất cả nhân vật đã có mặt trên bản đồ.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MapView;