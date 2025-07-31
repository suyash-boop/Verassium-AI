# 🚀 VERASSIUM AI

<div align="center">

![Verassium AI](https://img.shields.io/badge/Verassium-AI%20Chatbot-e96bff?style=for-the-badge&logo=robot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A vibrant, neobrutalism-styled AI chatbot platform with multiple model support**



</div>

---

## ✨ Features

### 🤖 **Multi-Model AI Support**
- **Llama 3 8B** - Fast & balanced for most tasks
- **Llama 3.3 70B** - Advanced reasoning capabilities  
- **Moonshot AI** - Creative & long context processing
- **Deepseek R1** - Specialized reasoning model

### 🎨 **Neobrutalism Design**
- **Bold Colors**: Vibrant purple, pink, yellow color scheme
- **Chunky Borders**: Thick black borders with shadow effects
- **Playful Animations**: Smooth rotations and hover effects
- **Interactive Elements**: Engaging micro-interactions

### 🔐 **Authentication & Security**
- NextAuth.js integration with multiple providers
- Secure session management
- Protected API routes

### 💬 **Chat Features**
- **Real-time messaging** with typing indicators
- **Chat history** management with persistent storage
- **Message actions**: Copy, retry, and edit capabilities
- **Responsive design** optimized for all devices

### 🗄️ **Database Integration**
- Prisma ORM with PostgreSQL/SQLite support
- Efficient chat and message storage
- User session persistence

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Database (PostgreSQL/SQLite)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/verassium.git
   cd verassium
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   DATABASE_URL="your-database-url"
   GROQ_API_KEY=your-groq-api-key
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎨 Design Philosophy

Verassium embraces the **Neobrutalism** design movement, characterized by:

### Color Palette
```css
Primary Purple: #e96bff
Secondary Purple: #a985ff  
Accent Yellow: #facc00
Accent Pink: #ff6678
Base Black: #000000
Pure White: #ffffff
```

### Typography
- **Headings**: Michroma (bold, futuristic)
- **Body**: Work Sans (clean, readable)
- **Display**: Pacifico (playful accents)

### Visual Elements
- **Bold borders** (2-4px black outlines)
- **Drop shadows** (4px-8px offset shadows)
- **Slight rotations** (-3° to 3° tilts)
- **Hover animations** (scale, lift, straighten)

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 14 | React framework with App Router |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Database** | Prisma + PostgreSQL | ORM and database |
| **Authentication** | NextAuth.js | Secure authentication |
| **UI Components** | Radix UI + shadcn/ui | Accessible component library |
| **Icons** | Lucide React | Beautiful icon set |
| **AI APIs** | Groq, OpenAI Compatible | Multiple AI model providers |

---

## 📁 Project Structure

```
verassium/
├── 📁 src/
│   ├── 📁 app/              # Next.js App Router
│   │   ├── 📁 api/          # API routes
│   │   ├── 📁 auth/         # Authentication pages
│   │   ├── 📁 dashboard/    # Main dashboard
│   │   └── 📄 globals.css   # Global styles
│   ├── 📁 components/       # React components
│   │   ├── 📁 chat/         # Chat interface
│   │   ├── 📁 providers/    # Context providers
│   │   └── 📁 ui/           # UI components
│   └── 📁 lib/              # Utility functions
├── 📁 prisma/               # Database schema
├── 📁 public/               # Static assets
└── 📄 package.json          # Dependencies
```

---

## 🔧 API Routes

### Chat Endpoints
- `POST /api/chat` - Send message to AI model
- `GET /api/chats` - Fetch user's chat history
- `DELETE /api/chats/[id]` - Delete specific chat
- `GET /api/chats/[id]/messages` - Get chat messages

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js handlers

---

## 🎯 Usage Examples

### Creating a New Chat
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello, how can you help me today?',
    model: 'llama3-8b-8192'
  })
});
```

### Switching AI Models
```typescript
const models = [
  'llama3-8b-8192',
  'llama-3.3-70b-versatile', 
  'moonshotai/kimi-k2-instruct',
  'deepseek-r1-distill-llama-70b'
];
```

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically


---


## 🙏 Acknowledgments

- **Groq** for lightning-fast AI inference
- **Vercel** for seamless deployment
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Next.js** team for the amazing framework

---
