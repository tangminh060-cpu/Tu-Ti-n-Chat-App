import React from 'react';
import { Character } from '../types';
import { SearchIcon, UserIcon, MapIcon, ChatBubbleIcon, PlusIcon, EyeIcon } from './icons';

interface ChatListProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
  onNavigateToCreate: () => void;
  onNavigateToProfile: () => void;
  onNavigateToExplore: () => void;
  onNavigateToMap: () => void;
  onSwitchAccount: () => void;
}

const ChatListHeader: React.FC<{ onSwitchAccount: () => void }> = ({ onSwitchAccount }) => (
    <header className="p-4 flex items-center justify-between sticky top-0 bg-black z-10">
        <h1 className="text-2xl font-bold">Trò chuyện</h1>
        <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-800">
                <SearchIcon className="w-6 h-6" />
            </button>
            <button onClick={onSwitchAccount} className="p-2 rounded-full hover:bg-gray-800" title="Chuyển đổi tài khoản / API Key">
                <UserIcon className="w-6 h-6" />
            </button>
        </div>
    </header>
);

const ChatListItem: React.FC<{character: Character, onSelect: () => void}> = ({ character, onSelect }) => (
    <li 
        onClick={onSelect}
        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
    >
        <img src={character.imageUrl} alt={character.name} className="w-14 h-14 rounded-full object-cover"/>
        <div className="flex-1 overflow-hidden">
            <h2 className="font-semibold">{character.name}</h2>
            <p className="text-sm text-gray-400 truncate">{character.biography}</p>
        </div>
    </li>
);

const MainNav: React.FC<{onCreate: () => void, onProfile: () => void, onExplore: () => void, onMap: () => void}> = ({ onCreate, onProfile, onExplore, onMap }) => (
    <nav className="flex justify-around items-center p-2 border-t border-gray-800 bg-black mt-auto">
        <button onClick={onMap} className="flex flex-col items-center text-gray-400 hover:text-white">
            <MapIcon className="w-6 h-6" />
            <span className="text-xs">Map</span>
        </button>
        <button className="flex flex-col items-center text-white">
            <ChatBubbleIcon className="w-6 h-6" />
            <span className="text-xs">Chat</span>
        </button>
        <button onClick={onCreate} className="p-3 bg-yellow-400 rounded-full text-black -mt-8 shadow-lg shadow-yellow-500/30">
            <PlusIcon className="w-7 h-7" />
        </button>
        <button onClick={onExplore} className="flex flex-col items-center text-gray-400 hover:text-white">
            <EyeIcon className="w-6 h-6" />
            <span className="text-xs">Explore</span>
        </button>
        <button onClick={onProfile} className="flex flex-col items-center text-gray-400 hover:text-white">
            <UserIcon className="w-6 h-6" />
            <span className="text-xs">Profile</span>
        </button>
    </nav>
);


const ChatList: React.FC<ChatListProps> = ({ characters, onSelectCharacter, onNavigateToCreate, onNavigateToProfile, onNavigateToExplore, onNavigateToMap, onSwitchAccount }) => {
  return (
    <div className="flex flex-col h-full bg-black">
        <ChatListHeader onSwitchAccount={onSwitchAccount} />
        <main className="flex-grow p-2 overflow-y-auto">
            <ul>
                {characters.map(char => (
                    <ChatListItem key={char.id} character={char} onSelect={() => onSelectCharacter(char)} />
                ))}
            </ul>
        </main>
        <MainNav onCreate={onNavigateToCreate} onProfile={onNavigateToProfile} onExplore={onNavigateToExplore} onMap={onNavigateToMap} />
    </div>
  );
};

export default ChatList;