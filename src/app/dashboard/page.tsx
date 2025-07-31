"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Plus, MessageSquare, MoreHorizontal, Edit, Trash2, Check, X } from "lucide-react"
import { format } from "date-fns"


interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/")
      return
    }
    fetchChats()
  }, [session, status, router])

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats")
      if (response.ok) {
        const data = await response.json()
        setChats(data.chats)
      }
    } catch (error) {
      console.error("Error fetching chats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setCurrentChatId(undefined)
  }

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId)
    setActiveDropdown(null)
  }

  const handleChatCreated = (newChatId: string) => {
    setCurrentChatId(newChatId)
    fetchChats()
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const startRename = (chat: Chat) => {
    setEditingChatId(chat.id)
    setEditingTitle(chat.title || "New Chat")
    setActiveDropdown(null)
  }

  const saveRename = async () => {
    if (!editingChatId || !editingTitle.trim()) return

    try {
      const response = await fetch(`/api/chats/${editingChatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() })
      })

      if (response.ok) {
        setChats(prev => prev.map(chat => 
          chat.id === editingChatId 
            ? { ...chat, title: editingTitle.trim() }
            : chat
        ))
      }
    } catch (error) {
      console.error("Error renaming chat:", error)
    } finally {
      setEditingChatId(null)
      setEditingTitle("")
    }
  }

  const cancelRename = () => {
    setEditingChatId(null)
    setEditingTitle("")
  }

  const confirmDelete = (chatId: string) => {
    setShowDeleteConfirm(chatId)
    setActiveDropdown(null)
  }

  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setChats(prev => prev.filter(chat => chat.id !== chatId))
        if (currentChatId === chatId) {
          setCurrentChatId(undefined)
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error)
    } finally {
      setShowDeleteConfirm(null)
    }
  }

  const toggleDropdown = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === chatId ? null : chatId)
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main mx-auto mb-2"></div>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#ff6678] border-r-4 border-black flex flex-col shadow-[8px_0_0_0_#000]">
        {/* User Info */}
        <div className="p-4 border-b-4 border-black bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img
                src={session.user.image || "/default-avatar.png"}
                alt={session.user.name || "User"}
                className="w-10 h-10 rounded-full border-2 border-black shadow-[2px_2px_0_0_#000]"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#facc00] rounded-full border border-black"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading text-foreground truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-foreground/70 truncate font-base">
                {session.user.email}
              </p>
            </div>
          </div>
          <Button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 transform hover:scale-105 transition-all duration-200 hover:shadow-[4px_4px_0_0_#000]"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-[#facc00] p-3 rounded-lg border-2 border-black shadow-[4px_4px_0_0_#000] mb-4 transform -rotate-1">
            <h3 className="text-lg font-heading text-black uppercase tracking-wide text-center">
              Chat History
            </h3>
          </div>
          {chats.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0_0_#000] transform rotate-1">
                <MessageSquare className="h-12 w-12 text-[#a985ff] mx-auto mb-3" />
                <p className="text-sm font-heading text-black mb-1">No chats yet</p>
                <p className="text-xs text-black/70 font-base">Start a conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {chats.map((chat, index) => (
                <div key={chat.id} className="relative group">
                  <button
                    onClick={() => handleChatSelect(chat.id)}
                    className={`w-full text-left p-4 rounded-lg text-sm transition-all transform hover:scale-105 hover:shadow-[4px_4px_0_0_#000] border-2 border-black font-base ${
                      currentChatId === chat.id
                        ? "bg-[#e96bff] text-white shadow-[4px_4px_0_0_#000] scale-105"
                        : index % 3 === 0 
                          ? "bg-[#a985ff] text-white hover:bg-[#9975ef]"
                          : index % 3 === 1
                          ? "bg-white text-black hover:bg-gray-50"
                          : "bg-[#facc00] text-black hover:bg-[#e6b800]"
                    }`}
                  >
                    {editingChatId === chat.id ? (
                      <div className="flex items-center gap-1 mb-1">
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") saveRename()
                            if (e.key === "Escape") cancelRename()
                          }}
                          className="text-xs h-6 px-2"
                          autoFocus
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            saveRename()
                          }}
                          className="p-1 hover:bg-main/20 rounded"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            cancelRename()
                          }}
                          className="p-1 hover:bg-main/20 rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-semibold truncate text-sm mb-1">
                            {chat.title || `Chat ${chat.id.slice(0, 8)}`}
                          </h3>
                          <p className="text-xs opacity-70 truncate font-base">
                            {format(new Date(chat.updatedAt), "MMM d, yyyy")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {index % 4 === 0 && (
                            <div className="w-3 h-3 bg-white rounded-full border-2 border-black flex-shrink-0"></div>
                          )}
                          {index % 4 === 1 && (
                            <div className="w-3 h-3 bg-[#facc00] rounded-full border-2 border-black flex-shrink-0"></div>
                          )}
                          {index % 4 === 2 && (
                            <div className="w-3 h-3 bg-[#e96bff] rounded-full border-2 border-black flex-shrink-0"></div>
                          )}
                          {index % 4 === 3 && (
                            <div className="w-3 h-3 bg-[#a985ff] rounded-full border-2 border-black flex-shrink-0"></div>
                          )}
                          <button
                            onClick={(e) => toggleDropdown(chat.id, e)}
                            className="opacity-50 hover:opacity-100 group-hover:opacity-100 p-1 hover:bg-black/10 rounded transition-all shrink-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    <p className="text-xs opacity-60 font-base">
                      {new Date(chat.updatedAt).toLocaleString()}
                    </p>
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === chat.id && (
                    <div className="absolute right-2 top-12 bg-background border border-border rounded-md shadow-lg z-20 py-1 min-w-[120px]">
                      <button
                        onClick={() => startRename(chat)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-secondary-background flex items-center gap-2 text-foreground"
                      >
                        <Edit className="h-3 w-3" />
                        Rename
                      </button>
                      <button
                        onClick={() => confirmDelete(chat.id)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={handleSignOut}
            variant="default"
            className="w-full flex items-center gap-2"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        <ChatInterface
          chatId={currentChatId}
          onNewChat={handleNewChat}
          onChatCreated={handleChatCreated}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-sm mx-4">
            <div className="text-center">
              <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Delete Chat
              </h3>
              <p className="text-foreground/70 mb-6">
                Are you sure you want to delete this chat? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => deleteChat(showDeleteConfirm)}
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  )
}