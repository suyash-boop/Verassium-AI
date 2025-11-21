"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import {
  Send,
  Bot,
  User,
  Plus,
  Copy,
  RotateCcw,
  Check,
  CheckIcon,
  ChevronsUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface ChatInterfaceProps {
  chatId?: string;
  onNewChat: () => void;
  onChatCreated?: (chatId: string) => void;
}

const AI_MODELS = [
  {
    value: "openai/gpt-oss-20b",
    label: "Open AI",
    description: "Fast & balanced - great for most tasks",
  },
  {
    value: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B",
    description: "More powerful - better reasoning",
  },
  {
    value: "moonshotai/kimi-k2-instruct",
    label: "Moonshot AI",
    description: "Creative & long context",
  },
  {
    value: "llama-3.1-8b-instant",
    label: "llama instant",
    description: "Meta's llama intant model",
  },
];

function ModelCombobox({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <Button
            variant="noShadow"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between max-w-[140px] md:max-w-[200px] text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2"
            onClick={() => setOpen(!open)}
          >
            <span className="truncate">
              {value
                ? AI_MODELS.find((model) => model.value === value)?.label
                : "Select model..."}
            </span>
            <ChevronsUpDown className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4 shrink-0 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[140px] md:w-[200px] p-0 bg-background border-2 border-border shadow-shadow"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search model..."
            className="h-8 md:h-9 text-xs md:text-sm"
          />
          <CommandList className="max-h-[150px] md:max-h-[200px]">
            <CommandEmpty className="py-4 md:py-6 text-center text-xs md:text-sm">
              No model found.
            </CommandEmpty>
            <CommandGroup>
              {AI_MODELS.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer text-xs md:text-sm py-2"
                >
                  <span className="truncate">{model.label}</span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-3 w-3 md:h-4 md:w-4",
                      value === model.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ChatInterface({
  chatId,
  onNewChat,
  onChatCreated,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(
    chatId
  );
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].value);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentModelData =
    AI_MODELS.find((model) => model.value === selectedModel) || AI_MODELS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setCurrentChatId(chatId);
    if (chatId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [chatId]);

  const fetchMessages = async () => {
    if (!chatId) return;

    try {
      const response = await fetch(`/api/chats/${chatId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const retryMessage = async (messageIndex: number) => {
    const userMessage = messages[messageIndex];
    if (!userMessage || userMessage.role !== "user") return;

    // Remove the user message and all messages after it (including bot response)
    const messagesToKeep = messages.slice(0, messageIndex);
    setMessages(messagesToKeep);

    // Set the input to the retry message content
    setInput(userMessage.content);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          chatId: currentChatId,
          model: selectedModel,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Add both user message and new bot response
        const newUserMessage: Message = {
          id: Date.now().toString(),
          content: userMessage.content,
          role: "user",
          createdAt: new Date().toISOString(),
        };

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: "assistant",
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newUserMessage, botMessage]);
        setInput("");

        // If this was a new chat, update the current chat ID
        if (!currentChatId && data.chatId) {
          setCurrentChatId(data.chatId);
          onChatCreated?.(data.chatId);
        }
      }
    } catch (error) {
      console.error("Error retrying message:", error);
      // Restore original messages on error
      fetchMessages();
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          chatId: currentChatId,
          model: selectedModel,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: "assistant",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);

        // If this was a new chat, update the current chat ID and notify parent
        if (!currentChatId && data.chatId) {
          setCurrentChatId(data.chatId);
          onChatCreated?.(data.chatId);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isLastUserMessage = (index: number) => {
    // Check if this is the last user message and it has a bot response after it
    return (
      (index === messages.length - 2 &&
        messages[index].role === "user" &&
        messages[index + 1]?.role === "assistant") ||
      (index === messages.length - 1 && messages[index].role === "user")
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b-4 border-black bg-white relative z-10 flex-shrink-0">
        <div className="flex items-center justify-between p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-main p-1.5 md:p-2 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000] transform -rotate-3 hover:rotate-0 transition-transform duration-200">
              <Bot className="h-5 w-5 md:h-7 md:w-7 text-main-foreground" />
            </div>
            <div className="transform -skew-x-12">
              <h1 className="text-lg md:text-2xl font-heading text-foreground tracking-tight">
                VERASSIUM
                <span className="inline-block bg-[#facc00] text-black px-1.5 py-0.5 md:px-2 md:py-1 ml-1 md:ml-2 text-xs md:text-sm rounded border-2 border-black shadow-[1px_1px_0_0_#000] md:shadow-[2px_2px_0_0_#000] transform skew-x-12 font-heading">
                  AI
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {/* Model Selector Combobox */}
            <div className="relative z-50 hidden sm:block">
              <ModelCombobox
                value={selectedModel}
                onValueChange={setSelectedModel}
              />
            </div>

            <div className="relative">
              <Button
                onClick={onNewChat}
                variant="default"
                size="sm"
                className="flex items-center gap-1 md:gap-2 transform hover:scale-105 transition-all duration-200 hover:shadow-[4px_4px_0_0_#000] md:hover:shadow-[6px_6px_0_0_#000] text-xs md:text-sm px-2 md:px-3"
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
              {/* Decorative elements */}
              <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ff6678] rounded-full border border-black"></div>
              <div className="absolute -bottom-0.5 -left-0.5 md:-bottom-1 md:-left-1 w-1 h-1 md:w-1.5 md:h-1.5 bg-[#facc00] rounded-full border border-black"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6 bg-gradient-to-br from-background via-background to-[#f8f9ff]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mb-4 md:mb-6 relative">
              <div className="bg-[#a985ff] p-3 md:p-4 rounded-full border-2 md:border-4 border-black shadow-[4px_4px_0_0_#000] md:shadow-[8px_8px_0_0_#000] transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <Bot className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 bg-[#facc00] rounded-full border-2 border-black animate-bounce"></div>
              <div className="absolute -bottom-0.5 -left-2 md:-bottom-1 md:-left-3 w-3 h-3 md:w-4 md:h-4 bg-[#ff6678] rounded-full border-2 border-black"></div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg border-2 md:border-4 border-black shadow-[4px_4px_0_0_#000] md:shadow-[8px_8px_0_0_#000] transform -rotate-1 hover:rotate-0 transition-transform duration-200 max-w-sm md:max-w-md">
              <h2 className="text-lg md:text-2xl font-heading text-black mb-2 md:mb-3 uppercase tracking-wide">
                Welcome to Verassium AI
              </h2>
              <div className="bg-[#e96bff] text-white px-2 md:px-3 py-1 md:py-2 rounded border-2 border-black shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000] mb-2 md:mb-3 inline-block transform rotate-1">
                <span className="font-heading text-xs md:text-sm">
                  Currently using {currentModelData.label}
                </span>
              </div>
              <p className="text-xs md:text-sm text-black/70 font-base">
                {currentModelData.description}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 md:gap-4 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl group relative",
                message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-3 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000] transform transition-all duration-200 hover:scale-110",
                  message.role === "user"
                    ? "bg-[#ff6678] text-white rotate-12 hover:rotate-0"
                    : "bg-[#facc00] text-black -rotate-12 hover:rotate-0"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 md:h-6 md:w-6" />
                ) : (
                  <Bot className="h-4 w-4 md:h-6 md:w-6" />
                )}
              </div>

              <div className="relative max-w-full">
                <div
                  className={cn(
                    "rounded-lg border-2 md:border-3 border-black px-3 py-2 md:px-6 md:py-4 shadow-[3px_3px_0_0_#000] md:shadow-[6px_6px_0_0_#000] transform transition-all duration-200 hover:shadow-[4px_4px_0_0_#000] md:hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1",
                    message.role === "user"
                      ? "bg-[#e96bff] text-white rotate-1 hover:rotate-0"
                      : "bg-white text-black -rotate-1 hover:rotate-0"
                  )}
                >
                  <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed font-base">
                    {message.content}
                  </p>
                  
                  {/* Decorative corner dots */}
                  <div className={cn(
                    "absolute w-2 h-2 md:w-3 md:h-3 rounded-full border border-black md:border-2",
                    message.role === "user" 
                      ? "bg-[#facc00] -top-0.5 -left-0.5 md:-top-1 md:-left-1" 
                      : "bg-[#a985ff] -top-0.5 -right-0.5 md:-top-1 md:-right-1"
                  )}></div>
                </div>

                {/* Hover Actions - Positioned outside the message bubble */}
                <div
                  className={cn(
                    "absolute flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-2 group-hover:translate-y-0",
                    message.role === "user"
                      ? "-left-2 md:-left-3 top-full mt-2 md:mt-3"
                      : "-right-2 md:-right-3 top-full mt-2 md:mt-3"
                  )}
                >
                  {message.role === "assistant" && (
                    <button
                      onClick={() =>
                        copyToClipboard(message.content, message.id)
                      }
                      className="bg-[#facc00] hover:bg-[#e6b800] border-2 border-black rounded-lg p-1.5 md:p-2 shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] md:hover:shadow-[5px_5px_0_0_#000] transform hover:-translate-y-1 transition-all duration-200"
                      title="Copy message"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-black" />
                      ) : (
                        <Copy className="h-3 w-3 md:h-4 md:w-4 text-black" />
                      )}
                    </button>
                  )}

                  {message.role === "user" && isLastUserMessage(index) && (
                    <button
                      onClick={() => retryMessage(index)}
                      disabled={isLoading}
                      className="bg-[#a985ff] hover:bg-[#9975ef] border-2 border-black rounded-lg p-1.5 md:p-2 shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] md:hover:shadow-[5px_5px_0_0_#000] transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50"
                      title="Retry message"
                    >
                      <RotateCcw
                        className={cn("h-3 w-3 md:h-4 md:w-4 text-white", isLoading && "animate-spin")}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 md:gap-4 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl mr-auto">
            <div className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-3 border-black bg-[#facc00] flex items-center justify-center shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000] -rotate-12 animate-pulse">
              <Bot className="h-4 w-4 md:h-6 md:w-6 text-black" />
            </div>
            <div className="bg-white border-2 md:border-3 border-black rounded-lg shadow-[3px_3px_0_0_#000] md:shadow-[6px_6px_0_0_#000] px-3 py-2 md:px-6 md:py-4 -rotate-1 relative">
              <div className="flex space-x-1 md:space-x-2">
                <div className="loading-dot w-2 h-2 md:w-3 md:h-3 bg-[#a985ff] rounded-full border border-black"></div>
                <div className="loading-dot w-2 h-2 md:w-3 md:h-3 bg-[#e96bff] rounded-full border border-black"></div>
                <div className="loading-dot w-2 h-2 md:w-3 md:h-3 bg-[#facc00] rounded-full border border-black"></div>
              </div>
              <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-[#ff6678] rounded-full border border-black md:border-2 -top-0.5 -right-0.5 md:-top-1 md:-right-1"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-6 border-t-4 border-black bg-white relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/4 w-3 h-3 md:w-4 md:h-4 bg-[#a985ff] rounded-full border-2 border-black transform -translate-y-1 md:-translate-y-2"></div>
        <div className="absolute top-0 right-1/3 w-2 h-2 md:w-3 md:h-3 bg-[#facc00] rounded-full border-2 border-black transform -translate-y-0.5 md:-translate-y-1"></div>
        
        <div className="flex gap-2 md:gap-3 max-w-4xl mx-auto relative">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${currentModelData.label} anything...`}
              disabled={isLoading}
              className="w-full border-2 md:border-3 border-black rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000] focus:shadow-[3px_3px_0_0_#000] md:focus:shadow-[6px_6px_0_0_#000] focus:-translate-y-1 transition-all duration-200 bg-white"
            />
            <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2 h-2 md:w-3 md:h-3 bg-[#ff6678] rounded-full border border-black md:border-2"></div>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 md:px-6 md:py-3 bg-[#e96bff] hover:bg-[#d654e8] text-white border-2 md:border-3 border-black rounded-lg shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] md:hover:shadow-[6px_6px_0_0_#000] transform hover:-translate-y-1 transition-all duration-200 font-heading uppercase tracking-wide text-sm md:text-base"
          >
            <Send className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
        <div className="text-center mt-3 md:mt-4">
          <div className="inline-block bg-[#facc00] px-3 py-1.5 md:px-4 md:py-2 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000] transform rotate-1">
            <span className="text-xs text-black font-heading uppercase tracking-wide">
              Using {currentModelData.label} • {currentModelData.description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
