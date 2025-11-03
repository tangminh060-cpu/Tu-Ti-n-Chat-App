
import React, { useState, useEffect, PropsWithChildren } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Character, UserPersona, RelationshipUnlockable, PersonaProfile, MapData } from './types';
import { INITIAL_CHARACTERS, INITIAL_PERSONAS, INITIAL_MAP_DATA } from './constants';
import ChatList from './components/ChatList';
import CharacterSelection from './components/CharacterSelection';
import ChatView from './components/ChatView';
import PersonaSwitcher from './components/PersonaSwitcher';
import PersonaManagement from './components/PersonaManagement';
import { CloseIcon, HeartIcon, LockIcon, GiftIcon, MapPinIcon, ThoughtBubbleIcon, EyeIcon } from './components/icons';
import Explore from './components/Explore';
import CharacterProfile from './components/CharacterProfile';
import MapView from './components/MapView';


// --- Helper Function ---
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


// --- Reusable Modal Component ---
interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  size?: 'md' | '2xl' | '4xl';
}
const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ title, isOpen, onClose, children, size = '2xl' }) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
      'md': 'max-w-md',
      '2xl': 'max-w-2xl',
      '4xl': 'max-w-4xl'
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};


// --- Persona Editing Modal ---
interface PersonaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: UserPersona | null;
  onSave: (persona: UserPersona) => void;
}
const EMPTY_PERSONA: UserPersona = { id: '', name: '', tagline: '', biography: '', imageUrl: '', stats: { congDuc: 0, nghiepLuc: 0, tinNguong: 0, khiVan: 0 } };
const PersonaEditModal: React.FC<PersonaEditModalProps> = ({ isOpen, onClose, persona, onSave }) => {
  const [formData, setFormData] = useState<UserPersona>(persona || EMPTY_PERSONA);
  const isCreating = !persona;

  useEffect(() => {
    setFormData(persona || EMPTY_PERSONA);
  }, [persona, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
   const handleStatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [name]: parseInt(value, 10) || 0
      }
    }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setFormData({ ...formData, imageUrl: base64 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        alert("Please upload an avatar.");
        return;
    }
    const personaToSave: UserPersona = {
        ...formData,
        id: persona?.id || `persona-${Date.now()}`
    };
    onSave(personaToSave);
    onClose();
  };

  return (
    <Modal title={isCreating ? "Tạo Persona Mới" : "Chỉnh Sửa Persona"} isOpen={isOpen} onClose={onClose}>
       <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
            <img src={formData.imageUrl || 'https://via.placeholder.com/96'} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover bg-gray-700"/>
            <div>
                <label htmlFor="persona-avatar-upload" className="block text-sm font-medium text-gray-300 mb-1">Tải Lên Ảnh Đại Diện</label>
                <input type="file" id="persona-avatar-upload" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400"/>
            </div>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Tên Persona</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
        </div>
         <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-gray-300 mb-1">Tagline</label>
          <input type="text" name="tagline" id="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
        </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="congDuc" className="block text-sm font-medium text-gray-300 mb-1">Công Đức</label>
              <input type="number" name="congDuc" id="congDuc" value={formData.stats.congDuc} onChange={handleStatChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label htmlFor="nghiepLuc" className="block text-sm font-medium text-gray-300 mb-1">Nghiệp Lực</label>
              <input type="number" name="nghiepLuc" id="nghiepLuc" value={formData.stats.nghiepLuc} onChange={handleStatChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label htmlFor="tinNguong" className="block text-sm font-medium text-gray-300 mb-1">Tín Ngưỡng</label>
              <input type="number" name="tinNguong" id="tinNguong" value={formData.stats.tinNguong} onChange={handleStatChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label htmlFor="khiVan" className="block text-sm font-medium text-gray-300 mb-1">Khí Vận</label>
              <input type="number" name="khiVan" id="khiVan" value={formData.stats.khiVan} onChange={handleStatChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            </div>
        </div>
        <div>
          <label htmlFor="biography" className="block text-sm font-medium text-gray-300 mb-1">Tiểu sử</label>
          <textarea name="biography" id="biography" value={formData.biography} onChange={handleChange} rows={5} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
        </div>
        <footer className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md font-semibold">Lưu</button>
        </footer>
      </form>
    </Modal>
  );
};


// --- Character Editing Modal ---
interface CharacterEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character | null;
  onSave: (character: Character) => void;
}
const EMPTY_STATS: Character['stats'] = { tinhCam: 0, tuVi: 'N/A', thoNguyen: 'N/A' };
const EMPTY_CURRENCY: Character['currency'] = { congDuc: 0, nghiepLuc: 0 };
const EMPTY_CHARACTER: Omit<Character, 'id' | 'viewerCount'> = { 
  name: '', tagline: '', tag: '', biography: '', greeting: '', imageUrl: '', 
  stats: EMPTY_STATS, currency: EMPTY_CURRENCY, alignment: 50, resources: '', magicItems: '', relationshipLevels: [],
  personality: '', lore: '', model: 'default',
};

const CharacterEditModal: React.FC<CharacterEditModalProps> = ({ isOpen, onClose, character, onSave }) => {
  const [formData, setFormData] = useState(character || EMPTY_CHARACTER);
  const isCreating = !character;

  useEffect(() => {
    setFormData(character || EMPTY_CHARACTER);
  }, [character, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
   const handleStatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, stats: { ...prev.stats, [name]: name === 'tinhCam' ? parseInt(value, 10) || 0 : value } }));
  };
   const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, currency: { ...prev.currency, [name]: parseInt(value, 10) || 0 } }));
  };
   const handleAlignmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, alignment: parseInt(e.target.value, 10) }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setFormData({ ...formData, imageUrl: base64 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!formData.imageUrl) {
        alert("Please upload an avatar.");
        return;
    }
    const characterToSave: Character = {
        ...(formData as Character),
        id: character?.id || `char-${Date.now()}`,
        viewerCount: character?.viewerCount || '0',
        tag: formData.tag || `@${formData.name.toLowerCase().replace(/\s+/g, '')}`,
        relationshipLevels: character?.relationshipLevels || []
    };
    onSave(characterToSave);
  };

  return (
    <Modal title={isCreating ? "Tạo Nhân Vật Mới" : "Chỉnh Sửa Nhân Vật"} isOpen={isOpen} onClose={onClose} size="4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Basic Info --- */}
        <div className="flex items-start space-x-6">
            <div className="flex flex-col items-center gap-2">
              <img src={formData.imageUrl || 'https://via.placeholder.com/128x192'} alt="Avatar Preview" className="w-32 h-48 rounded-md object-cover bg-gray-700"/>
              <label htmlFor="char-avatar-upload" className="w-full text-sm text-center cursor-pointer text-gray-400 p-2 bg-gray-800 rounded-md hover:bg-gray-700">Tải Lên Ảnh</label>
              <input type="file" id="char-avatar-upload" accept="image/*" onChange={handleFileChange} className="hidden"/>
            </div>
            <div className="flex-grow space-y-4">
              <div>
                <label htmlFor="char-name" className="block text-sm font-medium text-gray-300 mb-1">Tên Nhân Vật</label>
                <input type="text" name="name" id="char-name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
               <div>
                <label htmlFor="char-tag" className="block text-sm font-medium text-gray-300 mb-1">Tag (@handle)</label>
                <input type="text" name="tag" id="char-tag" value={formData.tag} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
              <div>
                <label htmlFor="char-tagline" className="block text-sm font-medium text-gray-300 mb-1">Tagline</label>
                <input type="text" name="tagline" id="char-tagline" value={formData.tagline} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
            </div>
        </div>

        {/* --- Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
              <label htmlFor="tinhCam" className="block text-sm font-medium text-gray-300 mb-1">Tình Cảm</label>
              <input type="number" name="tinhCam" id="tinhCam" value={formData.stats.tinhCam} onChange={handleStatChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2" />
            </div>
            <div>
              <label htmlFor="tuVi" className="block text-sm font-medium text-gray-300 mb-1">Tu Vi</label>
              <input type="text" name="tuVi" id="tuVi" value={formData.stats.tuVi} onChange={handleStatChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2" />
            </div>
            <div>
              <label htmlFor="thoNguyen" className="block text-sm font-medium text-gray-300 mb-1">Thọ Nguyên</label>
              <input type="text" name="thoNguyen" id="thoNguyen" value={formData.stats.thoNguyen} onChange={handleStatChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2" />
            </div>
        </div>
        
        {/* --- Currency --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
              <label htmlFor="congDuc" className="block text-sm font-medium text-gray-300 mb-1">Công Đức</label>
              <input type="number" name="congDuc" id="congDuc" value={formData.currency.congDuc} onChange={handleCurrencyChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2" />
            </div>
            <div>
              <label htmlFor="nghiepLuc" className="block text-sm font-medium text-gray-300 mb-1">Nghiệp Lực</label>
              <input type="number" name="nghiepLuc" id="nghiepLuc" value={formData.currency.nghiepLuc} onChange={handleCurrencyChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2" />
            </div>
        </div>

        {/* --- Alignment --- */}
        <div>
            <label htmlFor="alignment" className="block text-sm font-medium text-gray-300 mb-1">Thiên Đạo Lập Trường ({formData.alignment})</label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-red-400">Chống</span>
              <input type="range" name="alignment" id="alignment" min="0" max="100" value={formData.alignment} onChange={handleAlignmentChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
              <span className="text-xs text-blue-400">Thuận</span>
            </div>
        </div>

        {/* --- Textareas --- */}
         <div>
          <label htmlFor="char-greeting" className="block text-sm font-medium text-gray-300 mb-1">Lời Chào Mở Đầu</label>
          <textarea name="greeting" id="char-greeting" value={formData.greeting} onChange={handleChange} rows={3} required className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2" />
        </div>
        <div>
          <label htmlFor="char-biography" className="block text-sm font-medium text-gray-300 mb-1">Tiểu Sử / Mô Tả Nhân Vật</label>
          <textarea name="biography" id="char-biography" value={formData.biography} onChange={handleChange} rows={5} required className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2" />
        </div>
        <div>
          <label htmlFor="char-resources" className="block text-sm font-medium text-gray-300 mb-1">Tài Nguyên</label>
          <textarea name="resources" id="char-resources" value={formData.resources} onChange={handleChange} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2" />
        </div>
        <div>
          <label htmlFor="char-magicItems" className="block text-sm font-medium text-gray-300 mb-1">Pháp Bảo</label>
          <textarea name="magicItems" id="char-magicItems" value={formData.magicItems} onChange={handleChange} rows={5} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2" />
        </div>
        
        {/* --- Footer --- */}
        <footer className="flex justify-end gap-2 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold">Hủy</button>
            <button type="submit" className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md font-semibold">Lưu</button>
        </footer>
      </form>
    </Modal>
  );
};

// --- Relationship Level Modal ---
const UnlockableIcon: React.FC<{type: RelationshipUnlockable['type']}> = ({type}) => {
    const commonClass = "w-10 h-10";
    switch(type) {
        case 'feature': return <MapPinIcon className={commonClass} />;
        case 'thought': return <ThoughtBubbleIcon className={commonClass} />;
        case 'gift': return <GiftIcon className={commonClass} />;
        case 'scene': return <EyeIcon className={commonClass} />;
        default: return null;
    }
};

interface RelationshipModalProps {
    character: Character;
    onClose: () => void;
}
const RelationshipModal: React.FC<RelationshipModalProps> = ({ character, onClose }) => {
    const currentAffection = character.stats.tinhCam;

    const ShieldHeartIcon: React.FC<{ affection: number }> = ({ affection }) => (
        <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
            <svg className="absolute w-full h-full text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <span className="relative text-white font-bold text-2xl z-10">{affection}</span>
        </div>
    );

    return (
        <div 
            className="fixed inset-0 bg-[#1a2035] z-50 flex flex-col p-4 font-sans"
            onClick={onClose}
        >
            <header className="flex items-start justify-between text-white p-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <ShieldHeartIcon affection={currentAffection} />
                    <div>
                        <h1 className="text-2xl font-bold">{character.name}</h1>
                        <p className="text-sm text-gray-300">Phần thưởng cấp độ do người tạo đặt</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 bg-black/20 rounded-full hover:bg-black/40">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            <main className="flex-grow overflow-y-auto px-4 pb-8">
                <div className="relative pl-6">
                    {/* Vertical line */}
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-700"></div>

                    <div className="space-y-6">
                        {character.relationshipLevels.map((level, index) => {
                            const isUnlocked = currentAffection >= level.level;
                            return (
                                <div key={index} className="relative flex items-start gap-4">
                                    {/* Timeline Node */}
                                    <div className={`absolute left-0 top-1.5 -translate-x-1/2 w-7 h-7 flex items-center justify-center rounded-full ${isUnlocked ? 'bg-pink-400' : 'bg-gray-700'}`}>
                                        <HeartIcon 
                                            className={`w-4 h-4 ${isUnlocked ? 'text-pink-800' : 'text-gray-400'}`} 
                                            fill={isUnlocked ? "currentColor" : "none"}
                                        />
                                    </div>
                                    <div className="flex-grow flex items-start justify-between">
                                        <div className="flex-grow">
                                            {/* Level Pill */}
                                            <div className={`py-1 px-3 rounded-full inline-flex items-center gap-1.5 mb-2 ${isUnlocked ? 'bg-pink-500' : 'bg-gray-800'}`}>
                                                 <HeartIcon 
                                                     className={`w-4 h-4 text-white`} 
                                                     fill={isUnlocked ? "currentColor" : "none"}
                                                 />
                                                <p className="font-semibold text-white text-sm">{level.title}</p>
                                            </div>
                                            {/* Description */}
                                            <p className="text-gray-300 text-sm mb-4">{level.description}</p>
                                            
                                            {/* Unlockables */}
                                            {level.unlocks?.map((unlock, unlockIndex) => (
                                                <div key={unlockIndex} className={`bg-[#2a2f47] p-4 rounded-xl border ${isUnlocked ? 'border-purple-600/50' : 'border-gray-700'}`}>
                                                    <p className={`text-sm font-semibold mb-2 ${isUnlocked ? 'text-gray-300' : 'text-purple-400'}`}>
                                                        {isUnlocked ? 'Mở khóa tính năng mới' : 'Tính năng mới cần mở khóa'}
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-xl bg-[#3c3658] text-purple-300`}>
                                                            <UnlockableIcon type={unlock.type} />
                                                        </div>
                                                        <div>
                                                            <h4 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{unlock.title}</h4>
                                                            <p className="text-gray-400 text-sm">{unlock.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {!isUnlocked && (
                                            <div className="flex-shrink-0 flex items-center gap-1 text-gray-400 text-xs self-start mt-2 ml-4">
                                                <LockIcon className="w-3 h-3"/>
                                                <span>Mở khóa tất cả</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Persona Profile Modal ---
interface PersonaProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: PersonaProfile | null;
  onSave: (profile: PersonaProfile) => void;
}
const EMPTY_PERSONA_PROFILE: PersonaProfile = { relationship: '', howCharacterAddressesUser: '', secondPersonPronoun: '', description: '' };

const PersonaProfileModal: React.FC<PersonaProfileModalProps> = ({ isOpen, onClose, initialProfile, onSave }) => {
    const [formData, setFormData] = useState<PersonaProfile>(initialProfile || EMPTY_PERSONA_PROFILE);

    useEffect(() => {
        setFormData(initialProfile || EMPTY_PERSONA_PROFILE);
    }, [initialProfile, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4 font-sans" onClick={onClose}>
            <div className="bg-white text-black w-full max-w-md rounded-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                 <header className="flex justify-between items-center p-4">
                    <button onClick={onClose}><CloseIcon className="w-6 h-6" /></button>
                    <h2 className="text-lg font-bold">Thẻ hồ sơ</h2>
                    <div className="w-6"></div> {/* Spacer */}
                </header>
                <main className="p-6 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <label htmlFor="relationship" className="block text-sm font-bold text-gray-800 mb-2">Mối quan hệ</label>
                            <input type="text" name="relationship" id="relationship" value={formData.relationship} onChange={handleChange} className="w-full bg-transparent border-none focus:outline-none focus:ring-0" placeholder="Lão Tổ sư" />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <label htmlFor="howCharacterAddressesUser" className="block text-sm font-bold text-gray-800 mb-2">Cách xưng hô với bạn</label>
                            <input type="text" name="howCharacterAddressesUser" id="howCharacterAddressesUser" value={formData.howCharacterAddressesUser} onChange={handleChange} className="w-full bg-transparent border-none focus:outline-none focus:ring-0" placeholder="Ngài" />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <label htmlFor="secondPersonPronoun" className="block text-sm font-bold text-gray-800 mb-2">Ngôi thứ hai</label>
                            <input type="text" name="secondPersonPronoun" id="secondPersonPronoun" value={formData.secondPersonPronoun} onChange={handleChange} className="w-full bg-transparent border-none focus:outline-none focus:ring-0" placeholder="Ngài" />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <label htmlFor="description" className="block text-sm font-bold text-gray-800 mb-2">Mô tả</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none" placeholder="Những gì nhân vật biết về tôi. Ví dụ: tên, nghề nghiệp, mối quan hệ" />
                        </div>
                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity">
                            OK
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

// --- API Key Selection Screen ---
const ApiKeySelectionScreen: React.FC<{ onSelectKey: () => void }> = ({ onSelectKey }) => (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold mb-4">Chào mừng đến với Character Chat AI</h1>
        <p className="text-gray-400 mb-8 max-w-md">
            Để bắt đầu, bạn cần chọn một API key từ Google AI Studio. Ứng dụng này sử dụng các mô hình Gemini mạnh mẽ để mang các nhân vật đến với cuộc sống.
        </p>
        <button
            onClick={onSelectKey}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md font-semibold text-lg"
        >
            Chọn API Key
        </button>
        <p className="text-xs text-gray-500 mt-4">
            Bằng cách tiếp tục, bạn đồng ý với các điều khoản thanh toán.
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300 ml-1">
                Tìm hiểu thêm về thanh toán.
            </a>
        </p>
    </div>
);


// --- Main App Component ---
const App: React.FC = () => {
  const [view, setView] = useState<'chatList' | 'characterSelection' | 'chat' | 'personaManagement' | 'explore' | 'map'>('chatList');
  
  // State will be populated by useEffect from localStorage
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  const [personas, setPersonas] = useState<UserPersona[]>([]);
  const [activePersona, setActivePersona] = useState<UserPersona | null>(null);
  
  const [personaProfiles, setPersonaProfiles] = useState<Record<string, PersonaProfile>>({});
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [apiKeyReady, setApiKeyReady] = useState(false); // New state for API key

  // Modals State
  const [isPersonaEditModalOpen, setIsPersonaEditModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<UserPersona | null>(null);

  const [isCharacterEditModalOpen, setIsCharacterEditModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const [isPersonaSwitcherOpen, setIsPersonaSwitcherOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileCharacter, setProfileCharacter] = useState<Character | null>(null);
  
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [relationshipCharacter, setRelationshipCharacter] = useState<Character | null>(null);

  const [isPersonaProfileModalOpen, setIsPersonaProfileModalOpen] = useState(false);

  // Check for API key on mount
  useEffect(() => {
    const checkKey = async () => {
        // The `window.aistudio` object might not be available immediately.
        if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
            if (await (window as any).aistudio.hasSelectedApiKey()) {
                setApiKeyReady(true);
            }
        } else {
            // Retry if the object is not ready yet
            setTimeout(checkKey, 100);
        }
    };
    checkKey();
  }, []);
  
  const handleSelectApiKey = async () => {
    try {
        await (window as any).aistudio.openSelectKey();
        // Assume success to handle potential race condition where hasSelectedApiKey() might not be updated instantly
        setApiKeyReady(true);
    } catch (e) {
        console.error("Error opening API key selection:", e);
    }
  };

  const handleApiKeyError = () => {
    console.warn("API Key error detected. Prompting user to re-select.");
    setApiKeyReady(false);
  };


  // Load all data from localStorage on initial mount
  useEffect(() => {
    // Load Characters
    try {
      const savedCharacters = localStorage.getItem('characters');
      setCharacters(savedCharacters ? JSON.parse(savedCharacters) : INITIAL_CHARACTERS);
    } catch (error) {
      console.error("Error loading characters from localStorage:", error);
      setCharacters(INITIAL_CHARACTERS);
    }
    
    // Load Personas & Active Persona
    try {
      const savedPersonas = localStorage.getItem('personas');
      const parsedPersonas = savedPersonas ? JSON.parse(savedPersonas) : INITIAL_PERSONAS;
      setPersonas(parsedPersonas);
      
      if (parsedPersonas.length > 0) {
        const savedActivePersonaId = localStorage.getItem('activePersonaId');
        const active = parsedPersonas.find(p => p.id === savedActivePersonaId) || parsedPersonas[0];
        setActivePersona(active);
      } else {
        setActivePersona(null);
      }
    } catch (error) {
      console.error("Error loading personas from localStorage:", error);
      setPersonas(INITIAL_PERSONAS);
      setActivePersona(INITIAL_PERSONAS[0] || null);
    }
    
    // Load Persona Profiles
    try {
      const savedProfiles = localStorage.getItem('personaProfiles');
      setPersonaProfiles(savedProfiles ? JSON.parse(savedProfiles) : {});
    } catch (error) {
      console.error("Error loading persona profiles from localStorage:", error);
      setPersonaProfiles({});
    }
    
    // Load Map Data
    try {
        const savedMap = localStorage.getItem('mapData');
        setMapData(savedMap ? JSON.parse(savedMap) : INITIAL_MAP_DATA);
    } catch (error) {
        console.error("Error loading map data from localStorage:", error);
        setMapData(INITIAL_MAP_DATA);
    }

    setIsDataLoaded(true); // Signal that initial data load is complete
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Data Persistence ---

  // Save Characters whenever they change after initial load
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('characters', JSON.stringify(characters));
    }
  }, [characters, isDataLoaded]);

  // Save Personas whenever they change after initial load
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('personas', JSON.stringify(personas));
    }
  }, [personas, isDataLoaded]);

  // Save Active Persona whenever it changes after initial load
  useEffect(() => {
    if (isDataLoaded && activePersona) {
      localStorage.setItem('activePersonaId', activePersona.id);
    } else if (isDataLoaded && !activePersona) {
      localStorage.removeItem('activePersonaId');
    }
  }, [activePersona, isDataLoaded]);

  // Save persona profiles to local storage whenever they change after initial load
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('personaProfiles', JSON.stringify(personaProfiles));
    }
  }, [personaProfiles, isDataLoaded]);

  // Save map data whenever it changes after initial load
  useEffect(() => {
    if (isDataLoaded) {
        localStorage.setItem('mapData', JSON.stringify(mapData));
    }
  }, [mapData, isDataLoaded]);


  const handleStartChat = (character: Character) => {
    if (!activePersona && personas.length > 0) {
      setActivePersona(personas[0]);
    } else if (personas.length === 0) {
      alert("Please create a Persona first!");
      setView('personaManagement');
      return;
    }
    setSelectedCharacter(character);
    setView('chat');
  };

  const handleSaveCharacter = (characterToSave: Character) => {
    const isCreating = !characters.some(c => c.id === characterToSave.id);
    if (isCreating) {
      setCharacters(prev => [characterToSave, ...prev]);
    } else {
      setCharacters(prev => prev.map(c => c.id === characterToSave.id ? characterToSave : c));
      // If the currently selected/viewed character is the one being edited, update them
      if (selectedCharacter?.id === characterToSave.id) {
          setSelectedCharacter(characterToSave);
      }
      if (profileCharacter?.id === characterToSave.id) {
          setProfileCharacter(characterToSave);
      }
    }
    // Don't close the profile view, only the edit modal
    setIsCharacterEditModalOpen(false);
  };
  
  const handleSavePersona = (personaToSave: UserPersona) => {
    const isCreating = !personas.some(p => p.id === personaToSave.id);
     if (isCreating) {
      setPersonas(prev => [personaToSave, ...prev]);
      if (!activePersona) { // If this is the very first persona
          setActivePersona(personaToSave);
      }
    } else {
      setPersonas(prev => prev.map(p => p.id === personaToSave.id ? personaToSave : p));
      if(activePersona?.id === personaToSave.id) {
        setActivePersona(personaToSave);
      }
    }
    setIsPersonaEditModalOpen(false);
  };
  
  const handleSavePersonaProfile = (charId: string, personaId: string, profile: PersonaProfile) => {
    const key = `${charId}_${personaId}`;
    setPersonaProfiles(prev => ({...prev, [key]: profile}));
  };
  
  const openPersonaCreator = () => {
    setEditingPersona(null);
    setIsPersonaEditModalOpen(true);
  }
  
  const openPersonaEditor = (persona: UserPersona) => {
    setEditingPersona(persona);
    setIsPersonaEditModalOpen(true);
  }

  const openCharacterCreator = () => {
    setEditingCharacter(null);
    setIsCharacterEditModalOpen(true);
  }
  
  const openCharacterEditor = (character: Character) => {
    setEditingCharacter(character);
    setIsCharacterEditModalOpen(true);
  }

  const handleViewProfile = (character: Character) => {
      setProfileCharacter(character);
      setIsProfileOpen(true);
  }
  
  const handleViewRelationship = (character: Character) => {
    setRelationshipCharacter(character);
    setIsRelationshipModalOpen(true);
  };

  const handleNavigateToPersonaManagement = () => {
    setIsPersonaSwitcherOpen(false);
    setView('personaManagement');
  }
  
  const handleNavigateToExplore = () => {
      setView('explore');
  }
  
  const handleNavigateToMap = () => {
      setView('map');
  }

  const handleAffectionChange = (characterId: string, change: number) => {
    setCharacters(prevChars => 
        prevChars.map(c => {
            if (c.id === characterId) {
                const newAffection = c.stats.tinhCam + change;
                const clampedAffection = Math.max(-100, Math.min(500, newAffection));
                return { ...c, stats: { ...c.stats, tinhCam: clampedAffection } };
            }
            return c;
        })
    );

    if (selectedCharacter?.id === characterId) {
        setSelectedCharacter(prevChar => {
            if (!prevChar) return null;
            const newAffection = prevChar.stats.tinhCam + change;
            const clampedAffection = Math.max(-100, Math.min(500, newAffection));
            return {
                ...prevChar,
                stats: {
                    ...prevChar.stats,
                    tinhCam: clampedAffection
                }
            };
        });
    }
  };

  const handleCharacterModelChange = (characterId: string, newModel: string) => {
    const updatedCharacters = characters.map(c => 
        c.id === characterId ? { ...c, model: newModel } : c
    );
    setCharacters(updatedCharacters);
    
    // Also update the selected character if they are the one being edited
    if (selectedCharacter?.id === characterId) {
        setSelectedCharacter(prev => prev ? { ...prev, model: newModel } : null);
    }
  };
  
  const generateActivityName = async (character: Character): Promise<string> => {
    if (!process.env.API_KEY) return "Lỗi: API Key chưa được thiết lập.";
    if (!activePersona || !mapData) return "Lỗi: Dữ liệu người dùng hoặc bản đồ bị thiếu.";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
        BỐI CẢNH: Nhân vật ${character.name} (${character.tagline}) đang ở địa điểm "${mapData.name}", được mô tả là "${mapData.description}". Người dùng, trong vai ${activePersona.name} (${activePersona.tagline}), tiếp cận họ.
        YÊU CẦU: Dựa trên tính cách của ${character.name} (${character.personality}), hãy đề xuất một tên hoạt động ngắn gọn, hấp dẫn mà hai người có thể làm cùng nhau ngay tại đó.
        VÍ DỤ: "Khám phá phế tích cổ", "Thảo luận về thế cờ", "Tìm nơi trú mưa", "Săn bắn trong rừng".
        QUY TẮC: Chỉ trả lời bằng TÊN HOẠT ĐỘNG. Không thêm bất kỳ lời giải thích hay câu chữ nào khác.
    `;
    
    try {
        const modelToUse = character.model === 'default' ? 'gemini-2.5-flash' : (character.model || 'gemini-2.5-flash');
        const response = await ai.models.generateContent({
            model: modelToUse,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating activity name:", error);
        if (error instanceof Error && error.message.includes("Requested entity was not found")) {
            handleApiKeyError();
            return "Lỗi xác thực, vui lòng chọn lại API key.";
        }
        return "Gợi ý thất bại";
    }
  };


  const renderContent = () => {
    switch(view) {
      case 'chat':
        if (!activePersona) {
            setView('personaManagement'); // Redirect to create persona if none exists
            return (
              <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-center p-4">
                <p className="text-white text-xl mb-4">Bạn cần tạo một Persona để bắt đầu trò chuyện.</p>
                <button 
                  onClick={() => setView('personaManagement')} 
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md font-semibold"
                >
                  Đến trang quản lý Persona
                </button>
              </div>
            );
        }
        if (selectedCharacter) {
          const personaProfileKey = `${selectedCharacter.id}_${activePersona.id}`;
          const activePersonaProfile = personaProfiles[personaProfileKey] || null;

          return <ChatView 
            character={selectedCharacter} 
            userPersona={activePersona}
            personaProfile={activePersonaProfile}
            onBack={() => setView('chatList')} 
            onSwitchPersona={() => setIsPersonaSwitcherOpen(true)}
            onViewProfile={handleViewProfile}
            onViewRelationship={handleViewRelationship}
            onAffectionChange={handleAffectionChange}
            onOpenPersonaProfile={() => setIsPersonaProfileModalOpen(true)}
            onModelChange={handleCharacterModelChange}
            onApiKeyError={handleApiKeyError}
          />;
        }
        return null; // Should not happen if logic is correct
      case 'characterSelection':
        return <CharacterSelection 
          characters={characters} 
          onSelectCharacter={handleStartChat}
          onEditCharacter={openCharacterEditor}
          onCreateCharacter={openCharacterCreator}
          onBack={() => setView('chatList')}
        />;
       case 'explore':
          return <Explore
            characters={characters}
            onSelectCharacter={handleStartChat}
            onEditCharacter={openCharacterEditor}
            onBack={() => setView('chatList')}
           />;
      case 'personaManagement':
        return <PersonaManagement 
          personas={personas}
          onBack={() => setView('chatList')}
          onAddPersona={openPersonaCreator}
          onEditPersona={openPersonaEditor}
        />;
        case 'map':
            if (mapData && activePersona) {
                return <MapView 
                    mapData={mapData}
                    characters={characters}
                    onMapDataChange={setMapData}
                    onStartChat={handleStartChat}
                    onBack={() => setView('chatList')}
                    onGenerateActivity={generateActivityName}
                />
            }
            return null;
      case 'chatList':
      default:
        return <ChatList 
          characters={characters} 
          onSelectCharacter={handleStartChat}
          onNavigateToCreate={() => setView('characterSelection')}
          onNavigateToProfile={() => setView('personaManagement')}
          onNavigateToExplore={handleNavigateToExplore}
          onNavigateToMap={handleNavigateToMap}
          onSwitchAccount={handleSelectApiKey}
        />;
    }
  };
  
  if (!apiKeyReady) {
    return <ApiKeySelectionScreen onSelectKey={handleSelectApiKey} />;
  }
  
  if (!isDataLoaded) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Đang tải vũ trụ của bạn...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black font-sans">
      <div className="h-full w-full max-w-lg mx-auto bg-black">
        {renderContent()}
      </div>

      {activePersona && <PersonaSwitcher
        isOpen={isPersonaSwitcherOpen}
        onClose={() => setIsPersonaSwitcherOpen(false)}
        personas={personas}
        activePersona={activePersona}
        onSelectPersona={setActivePersona}
        onManage={handleNavigateToPersonaManagement}
      />}
      
      <CharacterEditModal 
        isOpen={isCharacterEditModalOpen}
        onClose={() => setIsCharacterEditModalOpen(false)}
        character={editingCharacter}
        onSave={handleSaveCharacter}
      />

      <PersonaEditModal 
        isOpen={isPersonaEditModalOpen}
        onClose={() => setIsPersonaEditModalOpen(false)}
        persona={editingPersona}
        onSave={handleSavePersona}
      />
      
      {activePersona && <PersonaProfileModal
        isOpen={isPersonaProfileModalOpen}
        onClose={() => setIsPersonaProfileModalOpen(false)}
        initialProfile={selectedCharacter ? personaProfiles[`${selectedCharacter.id}_${activePersona.id}`] : null}
        onSave={(profileData) => {
            if (selectedCharacter && activePersona) {
                handleSavePersonaProfile(selectedCharacter.id, activePersona.id, profileData);
            }
        }}
      />}

      {isProfileOpen && profileCharacter && (
          <CharacterProfile 
            initialCharacter={profileCharacter} 
            onClose={() => setIsProfileOpen(false)} 
            onSave={handleSaveCharacter}
          />
      )}

      {isRelationshipModalOpen && relationshipCharacter && (
          <RelationshipModal 
            character={relationshipCharacter} 
            onClose={() => setIsRelationshipModalOpen(false)}
          />
      )}
    </div>
  );
};

export default App;
