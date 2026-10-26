import React, { useState } from 'react';
import {
  Plus,
  Search,
  Clock,
  FolderGit2,
  Folder,
  MoreHorizontal,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal,
  Trash2,
  Edit2,
  Share2,
} from 'lucide-react';
import { RepoAiLogo } from './RepoAiLogo';

export interface ChatSession {
  id: string;
  repoFullName: string;
  title: string;
  subtitle: string;
  timestamp: string;
}

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onShareSession: (session: ChatSession) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onOpenSearch?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onShareSession,
  isDarkMode,
  onToggleDarkMode,
  isOpen,
  onToggleOpen,
  onOpenSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.repoFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
    setActiveMenuId(null);
  };

  const handleSaveRename = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  if (!isOpen) {
    return (
      <div className="hidden lg:flex flex-col items-center py-4 px-2 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117] w-14 shrink-0 transition-all">
        <button
          onClick={onToggleOpen}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Open Sidebar"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>

        <div className="mt-4 flex flex-col items-center gap-3">
          <RepoAiLogo size="xs" showWordmark={false} />
          <button
            onClick={onNewChat}
            className="p-2 rounded-xl bg-gradient-to-r from-sky-500/15 to-blue-600/15 hover:from-sky-500/25 hover:to-blue-600/25 text-sky-500 border border-sky-500/20 transition-all shadow-sm"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 lg:w-72 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117] shrink-0 select-none z-30 transition-all">
      {/* Top Header with Official RepoAI Logo */}
      <div className="flex items-center justify-between p-3.5 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <RepoAiLogo size="sm" showWordmark={true} />

        <button
          onClick={onToggleOpen}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Collapse Sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pt-3">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={() => onOpenSearch && onOpenSearch()}
            placeholder="Search chats & tools (⌘K)..."
            className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 cursor-pointer"
          />
          <kbd className="absolute right-2 px-1.5 py-0.2 text-[9px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-800 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* New Chat Primary Button: Clean Minimal */}
      <div className="px-3 pt-2.5">
        <button
          onClick={onNewChat}
          className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* RECENT Section List */}
      <div className="flex-1 overflow-y-auto px-3 pt-4 space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 block mb-1">
          Recent
        </span>

        {filteredSessions.map((session) => {
          const isActive = activeSessionId === session.id;
          const isMenuOpen = activeMenuId === session.id;

          return (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group relative p-2 rounded-lg cursor-pointer text-xs transition-colors border ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
                  : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
              }`}
            >
              {editingId === session.id ? (
                <form onSubmit={(e) => handleSaveRename(session.id, e)} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                    onBlur={(e) => handleSaveRename(session.id, e)}
                    className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-sky-500 text-xs text-slate-900 dark:text-white"
                  />
                </form>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 overflow-hidden flex-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        isActive ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <div className="overflow-hidden flex-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {session.title}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {session.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 3-dots Conversation Actions Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-opacity"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>

                    {/* Popover Actions from Figma */}
                    {isMenuOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-7 w-36 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 text-xs font-medium text-slate-700 dark:text-slate-200 animate-fadeIn"
                      >
                        <button
                          onClick={(e) => startRename(session, e)}
                          className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-3 h-3 text-slate-400" />
                          <span>Rename</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShareSession(session);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Share2 className="w-3 h-3 text-slate-400" />
                          <span>Share</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 flex items-center gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dark Mode Toggle Switch (from Figma) */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          {isDarkMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
          <span>Dark Mode</span>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={onToggleDarkMode}
          className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${
            isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'
          }`}
          title="Toggle Theme"
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
              isDarkMode ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </aside>
  );
};
