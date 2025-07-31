"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Send, Bot, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  
  const demoMessages = [
    {
      id: "1",
      content:
        "Hello! I'm Verassium AI, your intelligent assistant. I can help you with questions, creative tasks, problem-solving, and much more!",
      role: "assistant" as const,
    },
    {
      id: "2",
      content: "What can you help me with?",
      role: "user" as const,
    },
    {
      id: "3",
      content:
        "I can assist you with:\n• Answering questions on various topics\n• Creative writing and brainstorming\n• Code explanations and programming help\n• Problem-solving and analysis\n• General conversation and much more!\n\nSign in to start chatting with me!",
      role: "assistant" as const,
    },
  ];

  const handleSendMessage = () => {
    if (!session) {
      setShowSignInPrompt(true);
      return;
    }
    
    window.location.href = "/dashboard";
  };

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-[#556cde] relative overflow-hidden flex flex-col">
      {/* Background geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Blue circle - top left */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600 rounded-full border-4 border-black md:block hidden"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-600 rounded-full border-2 border-black md:hidden"></div>
        
        {/* Yellow circle - bottom left */}
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#facc00] rounded-full border-4 border-black hidden md:block"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-[#facc00] rounded-full border-2 border-black md:hidden"></div>
        
        {/* Pink triangle - top right */}
        <div className="absolute top-20 right-20 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[100px] border-l-transparent border-r-transparent border-b-pink-400 transform rotate-12 hidden md:block">
          <div className="absolute -bottom-[96px] -left-[56px] w-0 h-0 border-l-[56px] border-r-[56px] border-b-[96px] border-l-transparent border-r-transparent border-b-black"></div>
        </div>
        <div className="absolute top-10 right-4 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-pink-400 transform rotate-12 md:hidden">
          <div className="absolute -bottom-[48px] -left-[28px] w-0 h-0 border-l-[28px] border-r-[28px] border-b-[48px] border-l-transparent border-r-transparent border-b-black"></div>
        </div>
        
        {/* White organic shapes - center */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <div className="relative">
            {/* Top oval */}
            <div className="w-32 h-20 bg-white border-4 border-black rounded-full transform -rotate-12"></div>
            {/* Middle oval */}
            <div className="w-32 h-20 bg-white border-4 border-black rounded-full transform rotate-6 -mt-4"></div>
            {/* Bottom curved shape */}
            <div className="w-24 h-16 bg-white border-4 border-black rounded-full transform -rotate-12 -mt-2 ml-2"></div>
          </div>
        </div>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:hidden">
          <div className="w-16 h-10 bg-white border-2 border-black rounded-full transform -rotate-12"></div>
        </div>
        
        {/*pink triangle - bottom right */}
        <div className="absolute bottom-32 right-10 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-pink-300 transform -rotate-45 hidden md:block">
          <div className="absolute -bottom-[56px] -left-[36px] w-0 h-0 border-l-[36px] border-r-[36px] border-b-[56px] border-l-transparent border-r-transparent border-b-black"></div>
        </div>
        <div className="absolute bottom-16 right-4 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-pink-300 transform -rotate-45 md:hidden">
          <div className="absolute -bottom-[28px] -left-[18px] w-0 h-0 border-l-[18px] border-r-[18px] border-b-[28px] border-l-transparent border-r-transparent border-b-black"></div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b-4 border-black bg-white relative z-10 shadow-[0_8px_0_0_#000] flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-main p-1.5 md:p-2 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000] transform -rotate-3 hover:rotate-0 transition-transform duration-200">
              <Bot className="h-6 w-6 md:h-8 md:w-8 text-main-foreground" />
            </div>
            <div className="transform -skew-x-12">
              <h1 className="text-xl md:text-3xl font-heading text-foreground tracking-tight">
                VERASSIUM
                <span className="inline-block bg-[#facc00] text-black px-1.5 py-0.5 md:px-2 md:py-1 ml-1 md:ml-2 text-sm md:text-lg rounded border-2 border-black shadow-[1px_1px_0_0_#000] md:shadow-[2px_2px_0_0_#000] transform skew-x-12 font-heading">
                  AI
                </span>
              </h1>
            </div>
          </div>
          {!session && (
            <div className="relative">
              <Button 
                onClick={handleSignIn} 
                variant="default"
                className="transform hover:scale-105 transition-all duration-200 hover:shadow-[4px_4px_0_0_#000] md:hover:shadow-[6px_6px_0_0_#000] text-xs md:text-sm px-3 md:px-4 py-2"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="hidden sm:inline">Sign In with Google</span>
                <span className="sm:hidden">Sign In</span>
              </Button>
              {/* Decorative elements */}
              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-2 h-2 md:w-3 md:h-3 bg-[#ff6678] rounded-full border border-black"></div>
              <div className="absolute -bottom-0.5 -left-0.5 md:-bottom-1 md:-left-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#facc00] rounded-full border border-black"></div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto flex-1 flex flex-col relative z-10 overflow-hidden px-4">
        {/* Welcome Section */}
        <div className="text-center py-3 md:py-4 flex-shrink-0">
          <div className="bg-[#facc00] p-3 md:p-4 rounded-lg shadow-shadow relative border-2 md:border-4 border-black">
            <h2 className="text-lg md:text-2xl font-heading text-black mb-1 md:mb-2">VERASSIUM</h2>
            <p className="text-sm md:text-lg text-black font-base">
              Try our intelligent chatbot below. Sign in with Google to save your conversations.
            </p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col bg-[#ff4d4f] shadow-shadow rounded-lg mb-3 md:mb-4 overflow-hidden border-2 md:border-4 border-black relative z-10 min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
            {demoMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 md:gap-3 max-w-xs sm:max-w-md md:max-w-3xl",
                  message.role === "user"
                    ? "ml-auto flex-row-reverse"
                    : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center",
                    message.role === "user"
                      ? "bg-main text-main-foreground shadow-shadow"
                      : "bg-secondary-background shadow-shadow"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-3 w-3 md:h-4 md:w-4" />
                  ) : (
                    <Bot className="h-3 w-3 md:h-4 md:w-4" />
                  )}
                </div>

                <div
                  className={cn(
                    "rounded-lg px-3 md:px-4 py-2 max-w-full",
                    message.role === "user"
                      ? "bg-main text-main-foreground shadow-shadow"
                      : "bg-[#a985ff] shadow-shadow text-foreground"
                  )}
                >
                  <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-2 md:p-3 border-t border-border bg-[#a985ff] flex-shrink-0">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  session
                    ? "Type your message..."
                    : "Try typing a message (sign in required)"
                }
                className="flex-1 shadow-shadow text-sm md:text-base"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                size="sm"
                className="px-2 md:px-3"
              >
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>

            {!session && (
              <p className="text-center text-xs text-foreground/60 mt-2 px-2">
                💡 Sign in with Google to start chatting and save your conversation history
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sign In Prompt Modal */}
      {showSignInPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg p-4 md:p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <Bot className="h-8 w-8 md:h-12 md:w-12 text-main mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                Sign In to Continue
              </h3>
              <p className="text-sm md:text-base text-foreground/70 mb-4 md:mb-6">
                Sign in with Google to start chatting with Verassium AI and save
                your conversation history.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleSignIn}
                  className="flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign In with Google
                </Button>
                <Button
                  onClick={() => setShowSignInPrompt(false)}
                  variant="outline"
                  className="text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
