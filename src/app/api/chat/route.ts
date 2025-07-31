import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, chatId, model = "llama3-8b-8192" } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let currentChatId = chatId

    // If no chatId provided, create a new chat
    if (!currentChatId) {
      const newChat = await prisma.chat.create({
        data: {
          userId: session.user.id,
          title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
        }
      })
      currentChatId = newChat.id
    }

    // Save user message
    await prisma.message.create({
      data: {
        content: message,
        role: "user",
        chatId: currentChatId,
      }
    })

    // Get bot response from Groq API with selected model
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are Verassium AI, a helpful and intelligent assistant powered by ${model}. Be conversational, helpful, and provide clear, accurate responses. Adapt your communication style based on the model you're using - if you're a more powerful model, you can handle more complex reasoning tasks.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: model.includes("mixtral") ? 2048 : 1024,
        temperature: 0.7,
        stream: false
      })
    })

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json()
      console.error("Groq API error:", errorData)
      throw new Error("Failed to get AI response")
    }

    const groqData = await groqResponse.json()
    const botMessage = groqData.choices[0]?.message?.content || "Sorry, I couldn't process your request."

    // Save bot response
    await prisma.message.create({
      data: {
        content: botMessage,
        role: "assistant",
        chatId: currentChatId,
      }
    })

    return NextResponse.json({
      response: botMessage,
      chatId: currentChatId,
      model: model
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}