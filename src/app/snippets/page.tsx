"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Code, Grid, Layers, Search, Tag, X, Trash2, Star } from "lucide-react";
import { Icon } from "@iconify/react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// 模拟数据
const MOCK_SNIPPETS = [
  {
    id: '1',
    title: 'JavaScript 数组排序',
    language: 'javascript',
    code: `const arr = [3, 1, 4, 1, 5];
arr.sort((a, b) => a - b);`,
    userName: '张三',
    createdAt: '2024-03-20',
    stars: 23,
    isStarred: true
  },
  {
    id: '2',
    title: 'Python 列表推导式',
    language: 'python',
    code: `numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]`,
    userName: '李四',
    createdAt: '2024-03-19',
    stars: 15,
    isStarred: false
  }
];

export default function SnippetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [snippets, setSnippets] = useState(MOCK_SNIPPETS);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState<string | null>(null);

  const languages = [...new Set(snippets.map((s) => s.language))];

  const handleDelete = async (snippetId: string) => {
    setDeletingId(snippetId);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSnippets(prev => prev.filter(s => s.id !== snippetId));
      toast.success("代码片段已删除", {
        style: {
          background: '#1e1e2e',
          color: '#fff',
          border: '1px solid rgba(49, 50, 68, 0.5)',
        },
        iconTheme: {
          primary: '#3b82f6',
          secondary: '#1e1e2e',
        },
      });
      setDeleteDialogOpen(false);
    } catch {
      toast.error("删除失败，请重试", {
        style: {
          background: '#1e1e2e',
          color: '#fff',
          border: '1px solid rgba(49, 50, 68, 0.5)',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#1e1e2e',
        },
      });
    } finally {
      setDeletingId(null);
      setSnippetToDelete(null);
    }
  };

  const handleStar = (snippetId: string) => {
    setSnippets(prev => prev.map(s => {
      if (s.id === snippetId) {
        const newIsStarred = !s.isStarred;
        return {
          ...s,
          stars: s.stars + (newIsStarred ? 1 : -1),
          isStarred: newIsStarred
        };
      }
      return s;
    }));
    toast.success("已更新收藏状态", {
      style: {
        background: '#1e1e2e',
        color: '#fff',
        border: '1px solid rgba(49, 50, 68, 0.5)',
      },
      iconTheme: {
        primary: '#3b82f6',
        secondary: '#1e1e2e',
      },
    });
  };

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Toaster position="top-center" />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#1e1e2e] border-[#313244] text-white">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription className="text-gray-400">
              你确定要删除这个代码片段吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-[#262637]"
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => snippetToDelete && handleDelete(snippetToDelete)}
              disabled={deletingId !== null}
              className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              {deletingId ? (
                <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              ) : (
                "删除"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r
             from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
          >
            <BookOpen className="w-4 h-4" />
            代码片段库
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
          >
            发现和分享代码片段
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 mb-8"
          >
            探索社区精选的代码片段集合
          </motion.p>
        </div>

        {/* Filters Section */}
        <div className="relative max-w-5xl mx-auto mb-12 space-y-6">
          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400 z-10" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索代码片段（标题、语言或作者）..."
                className="w-full pl-12 pr-4 py-6 bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                  border-[#313244] hover:border-[#414155] transition-all duration-200
                  placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">编程语言：</span>
            </div>

            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang === selectedLanguage ? null : lang)}
                className={`
                  group relative px-3 py-1.5 rounded-lg transition-all duration-200
                  ${
                    selectedLanguage === lang
                      ? "text-blue-400 bg-blue-500/10 ring-2 ring-blue-500/50"
                      : "text-gray-400 hover:text-gray-300 bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-gray-800"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon icon={`logos:${lang}`} className="w-4 h-4" />
                  <span className="text-sm">{lang}</span>
                </div>
              </button>
            ))}

            {selectedLanguage && (
              <button
                onClick={() => setSelectedLanguage(null)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-3 h-3" />
                清除
              </button>
            )}

            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-gray-500">
                找到 {filteredSnippets.length} 个代码片段
              </span>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-md transition-all ${
                    view === "grid"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-md transition-all ${
                    view === "list"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Snippets Grid */}
        <motion.div
          className={`grid gap-6 ${
            view === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 max-w-3xl mx-auto"
          }`}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredSnippets.map((snippet) => (
              <Link
                key={snippet.id}
                href={`/snippets/${snippet.id}`}
                className="block"
              >
                <motion.div
                  layout
                  className="group relative"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative h-full bg-[#1e1e2e]/80 backdrop-blur-sm rounded-xl 
                    border border-[#313244]/50 hover:border-[#313244] 
                    transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 
                              group-hover:opacity-30 transition-all duration-500" />
                            <div className="relative p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                              group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500">
                              <Icon icon={`logos:${snippet.language}`} className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium">
                              {snippet.language}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Icon icon="lucide:clock" className="w-3 h-3" />
                              {snippet.createdAt}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStar(snippet.id);
                            }}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200
                              ${snippet.isStarred 
                                ? "bg-yellow-500/10 text-yellow-400" 
                                : "bg-gray-500/10 text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-400"
                              }`}
                          >
                            <Star 
                              className="w-3.5 h-3.5" 
                              fill={snippet.isStarred ? "currentColor" : "none"}
                              strokeWidth={2.5}
                            />
                            <span className="text-xs font-medium">{snippet.stars}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSnippetToDelete(snippet.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200
                              bg-gray-500/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1 
                            group-hover:text-blue-400 transition-colors">
                            {snippet.title}
                          </h2>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded-md bg-gray-800/50">
                                <Icon icon="lucide:user" className="w-3 h-3" />
                              </div>
                              <span className="truncate max-w-[150px]">{snippet.userName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="relative group/code">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/5 
                            rounded-lg opacity-0 group-hover/code:opacity-100 transition-all" />
                          <div className="relative overflow-hidden text-sm rounded-lg">
                            <SyntaxHighlighter
                              language={snippet.language}
                              style={oneDark}
                              customStyle={{
                                margin: 0,
                                padding: '1rem',
                                background: 'rgba(0, 0, 0, 0.3)',
                                maxHeight: '150px',
                              }}
                              showLineNumbers={true}
                              wrapLines={true}
                              wrapLongLines={true}
                            >
                              {snippet.code}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredSnippets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-md mx-auto mt-20 p-8 rounded-2xl overflow-hidden"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl 
                bg-gradient-to-br from-blue-500/10 to-purple-500/10 ring-1 ring-white/10 mb-6">
                <Code className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">未找到代码片段</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedLanguage
                  ? "请尝试调整搜索条件或筛选器"
                  : "成为第一个分享代码片段的人"}
              </p>

              {(searchQuery || selectedLanguage) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLanguage(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#262637] text-gray-300 
                    hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  清除所有筛选
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
