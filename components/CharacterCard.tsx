
import React from 'react';
import { Character } from '../types';
import { EyeIcon, PencilIcon } from './icons';

interface CharacterCardProps {
  character: Character;
  onSelect: () => void;
  onEdit: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onSelect, onEdit }) => {

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  }

  return (
    <div 
      className="relative rounded-lg overflow-hidden cursor-pointer group aspect-[2/3] transform transition-transform duration-300 hover:scale-105"
      onClick={onSelect}
    >
      <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
       <button onClick={handleEditClick} className="absolute top-2 right-2 p-2 bg-black/40 rounded-full hover:bg-black/70 transition-colors z-10" aria-label={`Edit ${character.name}`}>
          <PencilIcon className="w-5 h-5 text-white" />
       </button>
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="text-xl font-bold">{character.name}</h3>
        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{character.biography}</p>
        <div className="flex items-center text-xs text-gray-400 mt-2">
            <EyeIcon className="w-4 h-4 mr-1"/>
            <span>{character.viewerCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;