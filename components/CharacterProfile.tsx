import React, { useState, useEffect, ReactNode } from 'react';
import { Character, RelationshipLevel, RelationshipUnlockable } from '../types';
import { BackArrowIcon, SaveIcon, TrashIcon, PlusIcon } from './icons';
import EditableField from './EditableField';

interface CharacterProfileProps {
    initialCharacter: Character;
    onClose: () => void;
    onSave: (character: Character) => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// --- UI Components ---
interface TabButtonProps {
    label: string;
    tabKey: string;
    activeTab: string;
    setActiveTab: (tabKey: string) => void;
}
const TabButton: React.FC<TabButtonProps> = ({ label, tabKey, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(tabKey)}
        className={`px-3 py-2 text-sm font-semibold rounded-t-md transition-colors whitespace-nowrap ${
            activeTab === tabKey
                ? 'bg-[#1A1A1A] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
        }`}
    >
        {label}
    </button>
);

const ProfileSection: React.FC<{title: string, children: ReactNode}> = ({ title, children }) => (
    <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">{title}</h3>
        {children}
    </div>
);

const StatCard: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div className="bg-[#0D0D0D] p-3 rounded-md">
        <p className="text-xs text-gray-500 font-semibold tracking-wider">{label}</p>
        {children}
    </div>
);


const CharacterProfile: React.FC<CharacterProfileProps> = ({ initialCharacter, onClose, onSave }) => {
    const [editedCharacter, setEditedCharacter] = useState(initialCharacter);
    const [activeTab, setActiveTab] = useState<'info' | 'story' | 'ai' | 'relationships'>('info');

    useEffect(() => {
        setEditedCharacter(initialCharacter);
    }, [initialCharacter]);

    const handleFieldChange = <K extends keyof Character>(field: K, value: Character[K]) => {
        setEditedCharacter(prev => ({ ...prev, [field]: value }));
    };
    
    const handleNestedFieldChange = <
        K extends keyof Character, 
        F extends keyof Character[K]
    >(objKey: K, fieldKey: F, value: Character[K][F]) => {
        setEditedCharacter(prev => ({
            ...prev,
            [objKey]: {
                ...(prev[objKey] as object),
                [fieldKey]: value
            }
        }));
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            handleFieldChange('imageUrl', base64);
        }
    };

    // --- Relationship Level Handlers ---
    const handleRelationshipLevelChange = (index: number, field: keyof RelationshipLevel, value: any) => {
        const newLevels = [...editedCharacter.relationshipLevels];
        newLevels[index] = { ...newLevels[index], [field]: value };
        handleFieldChange('relationshipLevels', newLevels);
    };

    const addRelationshipLevel = () => {
        const newLevel: RelationshipLevel = {
            level: editedCharacter.relationshipLevels.length > 0 ? Math.max(...editedCharacter.relationshipLevels.map(l => l.level)) + 10 : 10,
            title: 'Cấp độ mới',
            description: 'Mô tả cấp độ...',
            unlocks: []
        };
        handleFieldChange('relationshipLevels', [...editedCharacter.relationshipLevels, newLevel]);
    };

    const removeRelationshipLevel = (index: number) => {
        handleFieldChange('relationshipLevels', editedCharacter.relationshipLevels.filter((_, i) => i !== index));
    };
    
    const handleUnlockableChange = (levelIndex: number, unlockIndex: number, field: keyof RelationshipUnlockable, value: string) => {
        const newLevels = [...editedCharacter.relationshipLevels];
        const newUnlocks = [...(newLevels[levelIndex].unlocks || [])];
        newUnlocks[unlockIndex] = { ...newUnlocks[unlockIndex], [field]: value };
        newLevels[levelIndex].unlocks = newUnlocks;
        handleFieldChange('relationshipLevels', newLevels);
    };

    const addUnlockable = (levelIndex: number) => {
        const newUnlock: RelationshipUnlockable = {
            type: 'feature',
            title: 'Mở khóa mới',
            description: 'Mô tả mở khóa...'
        };
        const newLevels = [...editedCharacter.relationshipLevels];
        newLevels[levelIndex].unlocks = [...(newLevels[levelIndex].unlocks || []), newUnlock];
        handleFieldChange('relationshipLevels', newLevels);
    };
    
    const removeUnlockable = (levelIndex: number, unlockIndex: number) => {
        const newLevels = [...editedCharacter.relationshipLevels];
        newLevels[levelIndex].unlocks = (newLevels[levelIndex].unlocks || []).filter((_, i) => i !== unlockIndex);
        handleFieldChange('relationshipLevels', newLevels);
    };

    const handleConfirmSave = () => {
        onSave(editedCharacter);
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-[#0D0D0D] z-40 flex flex-col animate-slide-in">
             <style>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
            `}</style>
             <header className="flex items-center justify-between p-4 flex-shrink-0 sticky top-0 bg-[#0D0D0D] z-10 border-b border-gray-800">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800">
                    <BackArrowIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3 min-w-0">
                     <label className="relative w-10 h-10 rounded-full group cursor-pointer flex-shrink-0">
                        <img src={editedCharacter.imageUrl} alt={editedCharacter.name} className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500 group-hover:opacity-50 transition-opacity" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <span className="text-white text-xs text-center">Đổi</span>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <div className="min-w-0">
                        <EditableField value={editedCharacter.name} onSave={(val) => handleFieldChange('name', String(val))}>
                            <h1 className="text-lg font-bold truncate">{editedCharacter.name}</h1>
                        </EditableField>
                    </div>
                </div>
                <button onClick={handleConfirmSave} className="p-2 rounded-full hover:bg-gray-700 text-yellow-400" title="Lưu thay đổi">
                    <SaveIcon className="w-6 h-6" />
                </button>
            </header>

            <nav className="flex px-4 border-b border-gray-800 flex-shrink-0 overflow-x-auto">
                <TabButton label="Thông Tin" tabKey="info" activeTab={activeTab} setActiveTab={(key) => setActiveTab(key as any)} />
                <TabButton label="Cốt Truyện" tabKey="story" activeTab={activeTab} setActiveTab={(key) => setActiveTab(key as any)} />
                <TabButton label="AI" tabKey="ai" activeTab={activeTab} setActiveTab={(key) => setActiveTab(key as any)} />
                <TabButton label="Quan Hệ" tabKey="relationships" activeTab={activeTab} setActiveTab={(key) => setActiveTab(key as any)} />
            </nav>

            <main className="flex-grow p-4 overflow-y-auto space-y-4">
                {activeTab === 'info' && (
                    <>
                        <ProfileSection title="Tagline">
                            <EditableField value={editedCharacter.tagline} onSave={(val) => handleFieldChange('tagline', String(val))}>
                                <p className="text-sm text-gray-300">{editedCharacter.tagline}</p>
                            </EditableField>
                        </ProfileSection>
                        <ProfileSection title="Chỉ Số Cơ Bản">
                             <div className="grid grid-cols-3 gap-4 text-center">
                                <StatCard label="TÌNH CẢM">
                                    <EditableField value={editedCharacter.stats.tinhCam} onSave={(val) => handleNestedFieldChange('stats', 'tinhCam', Number(val))} inputType="number">
                                         <p className="text-xl font-bold text-white">{editedCharacter.stats.tinhCam.toLocaleString()}</p>
                                    </EditableField>
                                </StatCard>
                                <StatCard label="TU VI">
                                     <EditableField value={editedCharacter.stats.tuVi} onSave={(val) => handleNestedFieldChange('stats', 'tuVi', String(val))}>
                                         <p className="text-xl font-bold text-white">{editedCharacter.stats.tuVi}</p>
                                     </EditableField>
                                </StatCard>
                                 <StatCard label="THỌ NGUYÊN">
                                     <EditableField value={editedCharacter.stats.thoNguyen} onSave={(val) => handleNestedFieldChange('stats', 'thoNguyen', String(val))}>
                                        <p className="text-xl font-bold text-white">{editedCharacter.stats.thoNguyen}</p>
                                     </EditableField>
                                </StatCard>
                             </div>
                        </ProfileSection>
                         <ProfileSection title="Thiên Tệ">
                             <div className="grid grid-cols-2 gap-4 text-center">
                                <StatCard label="CÔNG ĐỨC">
                                   <EditableField value={editedCharacter.currency.congDuc} onSave={(val) => handleNestedFieldChange('currency', 'congDuc', Number(val))} inputType="number">
                                        <p className="text-xl font-bold text-white">{editedCharacter.currency.congDuc.toLocaleString()}</p>
                                   </EditableField>
                                </StatCard>
                                <StatCard label="NGHIỆP LỰC">
                                   <EditableField value={editedCharacter.currency.nghiepLuc} onSave={(val) => handleNestedFieldChange('currency', 'nghiepLuc', Number(val))} inputType="number">
                                        <p className="text-xl font-bold text-white">{editedCharacter.currency.nghiepLuc.toLocaleString()}</p>
                                   </EditableField>
                                </StatCard>
                             </div>
                         </ProfileSection>
                        <ProfileSection title="Thiên Đạo Lập Trường">
                           <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between text-xs">
                                    <div className="text-red-400">Chống Thiên Đạo</div>
                                    <div className="text-blue-400">Thuận Thiên Đạo</div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-900/50">
                                    <div style={{ width: `${editedCharacter.alignment}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"></div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={editedCharacter.alignment}
                                    onChange={(e) => handleFieldChange('alignment', parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer absolute bottom-3 left-0"
                                />
                            </div>
                        </ProfileSection>
                    </>
                )}

                {activeTab === 'story' && (
                    <>
                        <ProfileSection title="Tiểu sử">
                            <EditableField value={editedCharacter.biography} onSave={(val) => handleFieldChange('biography', String(val))} inputType="textarea">
                                <p className="text-sm text-gray-300 whitespace-pre-wrap min-h-[6rem]">{editedCharacter.biography}</p>
                            </EditableField>
                        </ProfileSection>
                         <ProfileSection title="Kịch bản tổng quan (Lore)">
                            <EditableField value={editedCharacter.lore || ''} onSave={(val) => handleFieldChange('lore', String(val))} inputType="textarea">
                                <p className="text-sm text-gray-300 whitespace-pre-wrap min-h-[6rem]">{editedCharacter.lore || "Chưa xác định kịch bản."}</p>
                            </EditableField>
                        </ProfileSection>
                        <ProfileSection title="Tài Nguyên">
                            <EditableField value={editedCharacter.resources || ''} onSave={(val) => handleFieldChange('resources', String(val))} inputType="textarea">
                                <p className="text-sm text-gray-300 whitespace-pre-wrap min-h-[3rem]">{editedCharacter.resources || "Không có tài nguyên."}</p>
                            </EditableField>
                        </ProfileSection>
                         <ProfileSection title="Pháp Bảo">
                            <EditableField value={editedCharacter.magicItems || ''} onSave={(val) => handleFieldChange('magicItems', String(val))} inputType="textarea">
                                <p className="text-sm text-gray-300 whitespace-pre-wrap min-h-[3rem]">{editedCharacter.magicItems || "Không có pháp bảo."}</p>
                            </EditableField>
                        </ProfileSection>
                    </>
                )}

                {activeTab === 'ai' && (
                    <>
                         <ProfileSection title="Tính cách (Để nhân vật không OOC)">
                            <EditableField value={editedCharacter.personality || ''} onSave={(val) => handleFieldChange('personality', String(val))} inputType="textarea">
                                <p className="text-sm text-gray-300 whitespace-pre-wrap min-h-[6rem]">{editedCharacter.personality || "Chưa xác định tính cách."}</p>
                            </EditableField>
                        </ProfileSection>
                         <ProfileSection title="Cấu hình AI">
                           <label htmlFor="model-select" className="block text-xs text-gray-500 mb-1">Mô hình Phản hồi</label>
                            <select
                                id="model-select"
                                value={editedCharacter.model}
                                onChange={(e) => handleFieldChange('model', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="default">Mặc định (App)</option>
                                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Nhanh, Cân bằng)</option>
                                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Thông minh, Sáng tạo)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                Chọn mô hình AI sẽ ảnh hưởng đến tốc độ, sự sáng tạo và phong cách phản hồi của nhân vật.
                            </p>
                        </ProfileSection>
                    </>
                )}

                {activeTab === 'relationships' && (
                    <ProfileSection title="Cấp độ quan hệ">
                         <div className="space-y-4">
                            {editedCharacter.relationshipLevels.map((level, levelIndex) => (
                                <div key={levelIndex} className="bg-[#0D0D0D] p-3 rounded-lg border border-gray-700 space-y-3">
                                   <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-500 w-12">Level</label>
                                        <EditableField value={level.level} onSave={(val) => handleRelationshipLevelChange(levelIndex, 'level', Number(val))} inputType="number">
                                            <p className="font-semibold text-white">{level.level}</p>
                                        </EditableField>
                                        <EditableField value={level.title} onSave={(val) => handleRelationshipLevelChange(levelIndex, 'title', String(val))}>
                                            <p className="font-semibold text-white flex-grow">{level.title}</p>
                                        </EditableField>
                                        <button onClick={() => removeRelationshipLevel(levelIndex)} className="p-1 text-red-500 hover:bg-red-500/10 rounded-full">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                   </div>
                                   <EditableField value={level.description} onSave={(val) => handleRelationshipLevelChange(levelIndex, 'description', String(val))} inputType="textarea">
                                        <p className="text-sm text-gray-400 whitespace-pre-wrap">{level.description}</p>
                                   </EditableField>
                                   
                                   <div className="space-y-2 pl-4 border-l-2 border-gray-600">
                                        <h4 className="text-xs font-semibold text-gray-400">Mở khóa:</h4>
                                        {(level.unlocks || []).map((unlock, unlockIndex) => (
                                            <div key={unlockIndex} className="bg-black/20 p-2 rounded-md">
                                                 <div className="flex items-center gap-2">
                                                    <EditableField value={unlock.title} onSave={(val) => handleUnlockableChange(levelIndex, unlockIndex, 'title', String(val))}>
                                                        <p className="text-sm font-semibold text-purple-300 flex-grow">{unlock.title}</p>
                                                    </EditableField>
                                                     <button onClick={() => removeUnlockable(levelIndex, unlockIndex)} className="p-1 text-red-500 hover:bg-red-500/10 rounded-full">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                 </div>
                                                <EditableField value={unlock.description} onSave={(val) => handleUnlockableChange(levelIndex, unlockIndex, 'description', String(val))} inputType="textarea">
                                                    <p className="text-xs text-gray-500 whitespace-pre-wrap">{unlock.description}</p>
                                                </EditableField>
                                            </div>
                                        ))}
                                        <button onClick={() => addUnlockable(levelIndex)} className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                                            <PlusIcon className="w-3 h-3" /> Thêm Mở khóa
                                        </button>
                                   </div>
                                </div>
                            ))}
                             <button onClick={addRelationshipLevel} className="w-full flex items-center justify-center p-2 rounded-lg bg-[#0D0D0D] border-2 border-dashed border-gray-600 hover:border-yellow-500 hover:text-yellow-500 transition-colors">
                                <PlusIcon className="w-5 h-5 mr-2" />
                                <span className="font-semibold text-sm">Thêm Cấp độ</span>
                            </button>
                        </div>
                    </ProfileSection>
                )}
            </main>
        </div>
    );
};

export default CharacterProfile;