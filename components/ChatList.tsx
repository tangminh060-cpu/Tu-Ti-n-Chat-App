
import React from 'react';
import { Character, ChatSession } from '../types';
// Fix: Import `EyeIcon` to resolve the "Cannot find name 'EyeIcon'" error.
import { SearchIcon, UserIcon, MapIcon, ChatBubbleIcon, PlusIcon, EyeIcon } from './icons';

interface ChatListProps {
  characters: Character[];
  sessions: ChatSession[];
  onSelectCharacter: (character: Character) => void;
  onNavigateToCreate: () => void;
  onNavigateToProfile: () => void;
  onNavigateToExplore: () => void;
  onNavigateToMap: () => void;
}

const ChatListHeader: React.FC = () => (
    <header className="p-4 flex items-center justify-between sticky top-0 bg-black z-10">
        <h1 className="text-2xl font-bold">Trò chuyện</h1>
        <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-800">
                <SearchIcon className="w-6 h-6" />
            </button>
        </div>
    </header>
);

const ChatListItem: React.FC<{
    session: ChatSession;
    character?: Character;
    onSelect: () => void;
}> = ({ session, character, onSelect }) => {
    if (!character) return null;

    const lastMessage = session.messages[session.messages.length - 1];
    const messagePreview = lastMessage ? `${lastMessage.sender === 'user' ? 'Bạn: ' : ''}${lastMessage.text}` : 'Chưa có tin nhắn.';
    
    const timeSince = (date: number) => {
        const seconds = Math.floor((new Date().getTime() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "m";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
    };

    return (
        <li 
            onClick={onSelect}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
        >
            <img src={character.imageUrl} alt={character.name} className="w-14 h-14 rounded-full object-cover"/>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                    <h2 className="font-semibold truncate">{character.name}</h2>
                    <span className="text-xs text-gray-500 flex-shrink-0">{timeSince(session.lastMessageTimestamp)}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{messagePreview}</p>
            </div>
        </li>
    );
};


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


const ChatList: React.FC<ChatListProps> = ({ characters, sessions, onSelectCharacter, onNavigateToCreate, onNavigateToProfile, onNavigateToExplore, onNavigateToMap }) => {
  
  const sortedSessions = [...sessions].sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
  
  return (
    <div className="flex flex-col h-full bg-black">
        <ChatListHeader />
        <main className="flex-grow p-2 overflow-y-auto">
            {sortedSessions.length > 0 ? (
                 <ul>
                    {sortedSessions.map(session => (
                        <ChatListItem 
                            key={session.id} 
                            session={session} 
                            character={characters.find(c => c.id === session.characterId)}
                            onSelect={() => onSelectCharacter(characters.find(c => c.id === session.characterId)!)} 
                        />
                    ))}
                </ul>
            ) : (
                <div className="text-center text-gray-500 mt-20 px-4">
                    <p>Chào mừng bạn!</p>
                    <p className="mt-2">Nhấn nút `+` bên dưới để bắt đầu một cuộc trò chuyện mới.</p>
                </div>
            )}
        </main>
        <MainNav onCreate={onNavigateToCreate} onProfile={onNavigateToProfile} onExplore={onNavigateToExplore} onMap={onNavigateToMap} />
    </div>
  );
};

export default ChatList;
