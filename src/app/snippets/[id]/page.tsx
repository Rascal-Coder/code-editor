"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Star, User, Copy, Check, MessageSquare, CodeIcon, SendIcon, Trash2Icon } from "lucide-react";
import { Icon } from "@iconify/react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

// 模拟数据获取函数
const getSnippetById = (id: string) => {
  return {
    id,
    title: 'JavaScript 数组排序',
    language: 'javascript',
    code: `const arr = [3, 1, 4, 1, 5];
arr.sort((a, b) => a - b);

// 使用示例
console.log(arr); // [1, 1, 3, 4, 5]

// 自定义排序
const users = [
  { name: 'Tom', age: 25 },
  { name: 'Jerry', age: 20 },
  { name: 'Spike', age: 30 }
];

users.sort((a, b) => a.age - b.age);
console.log(users);`,
    userName: '张三',
    createdAt: '2024-03-20',
    stars: 23,
    isStarred: false
  };
};

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="relative my-4 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] border-b border-[#313244]">
        <span className="text-sm font-medium text-gray-400">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.3)',
          fontSize: '0.875rem',
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}

function CommentContent({ content }: { content: string }) {
  const parts = content.split(/(```[\w-]*\n[\s\S]*?\n```)/g);

  return (
    <div className="max-w-none text-white">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(/```([\w-]*)\n([\s\S]*?)\n```/);
          if (match) {
            const [, language, code] = match;
            return <CodeBlock language={language} code={code} key={index} />;
          }
        }
        return part.split("\n").map((line, lineIdx) => (
          <p key={lineIdx} className="mb-4 text-gray-300 last:mb-0">
            {line}
          </p>
        ));
      })}
    </div>
  );
}

interface CommentProps {
  comment: {
    _id: string;
    _creationTime: number;
    userId: string;
    userName: string;
    content: string;
  };
  currentUserId?: string;
  isDeleting: boolean;
  onDelete: (commentId: string) => void;
}

function Comment({ comment, currentUserId, isDeleting, onDelete }: CommentProps) {
  return (
    <div className="group">
      <div className="bg-[#0a0a0f] rounded-xl p-6 border border-[#ffffff0a] hover:border-[#ffffff14] transition-all">
        <div className="flex items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ffffff08] flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-[#808086]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[#e1e1e3] font-medium truncate">{comment.userName}</span>
              <span className="block text-sm text-[#808086]">
                {new Date(comment._creationTime).toLocaleDateString()}
              </span>
            </div>
          </div>

          {comment.userId === currentUserId && (
            <button
              onClick={() => onDelete(comment._id)}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all"
              title="Delete comment"
            >
              <Trash2Icon className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>

        <CommentContent content={comment.content} />
      </div>
    </div>
  );
}

function CommentForm({ isSubmitting, onSubmit }: { isSubmitting: boolean; onSubmit: (comment: string) => Promise<void> }) {
  const [comment, setComment] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newComment = comment.substring(0, start) + "  " + comment.substring(end);
      setComment(newComment);
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await onSubmit(comment);
    setComment("");
    setIsPreview(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="bg-[#0a0a0f] rounded-xl border border-[#ffffff0a] overflow-hidden">
        <div className="flex justify-end gap-2 px-4 pt-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`text-sm px-3 py-1 rounded-md transition-colors ${
              isPreview ? "bg-blue-500/10 text-blue-400" : "hover:bg-[#ffffff08] text-gray-400"
            }`}
          >
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {isPreview ? (
          <div className="min-h-[120px] p-4 text-[#e1e1e3">
            <CommentContent content={comment} />
          </div>
        ) : (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add to the discussion..."
            className="w-full bg-transparent border-0 text-[#e1e1e3] placeholder:text-[#808086] outline-none 
            resize-none min-h-[120px] p-4 font-mono text-sm"
          />
        )}

        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[#080809] border-t border-[#ffffff0a]">
          <div className="hidden sm:block text-xs text-[#808086] space-y-1">
            <div className="flex items-center gap-2">
              <CodeIcon className="w-3.5 h-3.5" />
              <span>Format code with ```language</span>
            </div>
            <div className="text-[#808086]/60 pl-5">
              Tab key inserts spaces • Preview your comment before posting
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all ml-auto"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <SendIcon className="w-4 h-4" />
                <span>Comment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function Comments() {
  // 模拟用户数据
  const user = { id: 'user1', fullName: '张三' };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // 模拟评论数据
  const [comments, setComments] = useState([
    {
      _id: '1',
      _creationTime: Date.now(),
      userId: 'user1',
      userName: '张三',
      content: '这是一个很有用的代码片段！\n\n```javascript\n// 示例使用\nconst arr = [5,2,3,1,4];\narr.sort((a,b) => a-b);\nconsole.log(arr); // [1,2,3,4,5]\n```',
    }
  ]);

  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true);
    try {
      // 模拟添加评论
      const newComment = {
        _id: Date.now().toString(),
        _creationTime: Date.now(),
        userId: user?.id || 'anonymous',
        userName: user?.fullName || 'Anonymous',
        content
      };
      setComments(prev => [...prev, newComment]);
      toast.success("评论已发布");
    } catch (error) {
      console.log("Error adding comment:", error);
      toast.error("发布失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);
    try {
      // 模拟删除评论
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success("评论已删除");
    } catch (error) {
      console.log("Error deleting comment:", error);
      toast.error("删除失败");
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discussion ({comments.length})
        </h2>
      </div>

      <div className="p-6 sm:p-8">
        {user ? (
          <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />
        ) : (
          <div className="bg-[#0a0a0f] rounded-xl p-6 text-center mb-8 border border-[#ffffff0a]">
            <p className="text-[#808086] mb-4">登录后参与讨论</p>
            <button className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors">
              登录
            </button>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              isDeleting={deletingCommentId === comment._id}
              currentUserId={user?.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SnippetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [snippet] = useState(() => getSnippetById(resolvedParams.id));
  const [isStarred, setIsStarred] = useState(snippet.isStarred);
  const [stars, setStars] = useState(snippet.stars);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("代码已复制到剪贴板", {
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

  const handleStar = () => {
    setIsStarred(!isStarred);
    setStars(prev => prev + (isStarred ? -1 : 1));
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

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Toaster position="top-center" />
      <div className="relative h-32 bg-[#1e1e2e] border-b border-[#313244]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20" />
              <div className="relative p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                <Icon icon={`logos:${snippet.language}`} className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {snippet.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{snippet.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{snippet.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:message-square" className="w-4 h-4" />
                  <span>0 comments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">
                    cpp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href="/snippets"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回列表</span>
        </Link>

        {/* 代码区域 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] border-b border-[#313244]">
              <div className="flex items-center gap-2">
                <Icon icon={`logos:${snippet.language}`} className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-400">{snippet.language}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200
                    bg-gray-500/10 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  ) : (
                    <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
                  )}
                </button>
                <button
                  onClick={handleStar}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200
                    ${isStarred 
                      ? "bg-yellow-500/10 text-yellow-400" 
                      : "bg-gray-500/10 text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-400"
                    }`}
                >
                  <Star 
                    className="w-3.5 h-3.5" 
                    fill={isStarred ? "currentColor" : "none"}
                    strokeWidth={2.5}
                  />
                  <span className="text-xs font-medium">{stars}</span>
                </button>
              </div>
            </div>
            <SyntaxHighlighter
              language={snippet.language}
              style={oneDark}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                background: 'rgba(30, 30, 46, 0.8)',
                fontSize: '0.95rem',
              }}
              showLineNumbers={true}
              wrapLines={true}
              wrapLongLines={true}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>
        </motion.div>

        {/* 评论区域 */}
        <div className="mt-8">
          <Comments />
        </div>
      </div>
    </div>
  );
} 