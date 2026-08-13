# 🎓 CodeCrafters

### AI-Powered Learning & Productivity Platform for Students

<p align="center">
  <strong>Learn Smarter • Stay Focused • Track Progress</strong>
</p>

<p align="center">
  🤖 AI Tutor &nbsp; • &nbsp;
  🧠 Smart Flashcards &nbsp; • &nbsp;
  📝 AI Notes &nbsp; • &nbsp;
  📅 Study Planner &nbsp; • &nbsp;
  🎯 Focus Timer &nbsp; • &nbsp;
  🧩 AI Quiz &nbsp; • &nbsp;
  📄 PDF Analyzer &nbsp; • &nbsp;
  🎙️ Voice Tutor &nbsp; • &nbsp;
  📊 Analytics
</p>

<p align="center">
  <a href="https://brain-boost-ai-delta.vercel.app/">
    🚀 Live Demo
  </a>
  &nbsp; • &nbsp;
  <a href="https://github.com/Diya030805/CodeCrafters">
    📂 GitHub Repository
  </a>
</p>

---

## 📖 About CodeCrafters

**CodeCrafters** is an AI-powered learning and productivity platform designed to help students **learn smarter, stay organized, maintain focus, and track their academic progress** from one unified workspace.

Instead of switching between multiple applications for studying, revision, planning, note-taking, productivity, and performance tracking, CodeCrafters brings these experiences together into a single intelligent learning environment.

The platform combines **AI-powered learning tools** with productivity and analytics features to create a personalized digital study companion.

### 💡 The Learning Cycle

> **Learn → Practice → Plan → Focus → Analyze → Improve**

CodeCrafters is designed around this complete learning cycle, helping students turn scattered study activities into a more structured and productive workflow.

---

## ✨ Why CodeCrafters?

Students often depend on different applications for different parts of their academic routine.

CodeCrafters brings these essential experiences together into **one centralized workspace**.

### 🎯 Our Goal

To create an intelligent study companion that helps students:

- Understand difficult concepts
- Create and revise learning material
- Organize academic tasks
- Maintain focused study sessions
- Track learning performance
- Build consistent study habits
- Stay motivated through progress and achievements

---

# 🚀 Core Features

## 🤖 AI Tutor

An interactive AI-powered study assistant designed to help students understand difficult concepts through conversational learning.

### Features

- Google Gemini AI integration
- Conversational learning interface
- Context-aware explanations
- Structured AI responses
- Markdown-supported answers
- Personalized learning assistance

---

## 🧠 Smart Flashcards

An interactive flashcard system designed for **active recall and revision**.

### Features

- AI-assisted flashcard generation
- Interactive card flipping
- Study progress tracking
- Persistent flashcard data
- Revision-focused learning experience

---

## 📝 AI Notes

A focused workspace for creating, organizing, and reviewing academic notes.

### Features

- Create and manage notes
- AI-assisted summaries
- Structured learning content
- Persistent storage
- Distraction-free interface

---

## 📅 Study Planner

A productivity workspace that helps students organize their academic workload and plan their study routine.

### Features

- Daily study planning
- Weekly schedule
- Upcoming deadlines
- Task management
- Priority-based tasks
- Progress tracking

---

## 🎯 Focus Timer

A dedicated study timer designed to help students maintain focused study sessions.

### Features

- Custom focus sessions
- Countdown timer
- Active session tracking
- Productivity monitoring
- Study-session tracking

---

## 🧩 AI Quiz

An AI-powered quiz experience designed to test knowledge and reinforce learning.

### Features

- Dynamic AI-generated questions
- Interactive quiz interface
- Difficulty-based quizzes
- Score tracking
- Learning-oriented feedback

---

## 📄 PDF Analyzer

A learning tool that helps students transform study documents into more useful learning material.

### Features

- Upload study PDFs
- AI-powered document analysis
- Extract important concepts
- Generate learning content
- Simplify complex material

---

## 🎙️ Voice Tutor

An interactive voice-based learning experience designed for conversational and hands-free studying.

### Features

- Voice interaction interface
- Conversational learning
- Hands-free study experience
- AI-powered tutoring workflow

---

## 📊 Learning Analytics

A visual analytics system that helps students understand their study activity and learning progress.

### Features

- Study statistics
- Progress visualization
- Performance overview
- Interactive charts
- Learning activity tracking

---

## 🏆 Gamification & Streaks

A motivation system designed to encourage consistent learning habits.

### Features

- XP progression
- Daily streaks
- Achievements
- Productivity milestones
- Learning progress tracking

---

# 🖥️ Platform Experience

CodeCrafters provides a unified student workspace where users can move between different learning and productivity tools without leaving the platform.

### Main Experience

```text
Landing Page
      ↓
Dashboard
      ↓
┌─────────────────────────────────────┐
│                                     │
│  AI Tutor        Smart Flashcards   │
│  AI Notes        Study Planner      │
│  Focus Timer     AI Quiz            │
│  PDF Analyzer    Voice Tutor        │
│  Analytics       Gamification       │
│                                     │
└─────────────────────────────────────┘
      ↓
Track Progress
      ↓
Improve Learning Habits
```

---

# 🎨 UI & UX

CodeCrafters focuses on providing a modern, interactive, and student-friendly experience.

### Design Highlights

- Modern dashboard interface
- Responsive design
- Light and dark themes
- Interactive components
- Smooth animations
- Micro-interactions
- Visual learning analytics
- Focused productivity workspace
- Clean navigation
- Mobile-friendly experience

---

# 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | Next.js 15 |
| **Frontend** | React |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Backend** | Next.js API Routes |
| **Database** | Supabase / PostgreSQL |
| **Authentication** | Supabase Auth |
| **AI** | Google Gemini API |
| **Charts** | Recharts |
| **Version Control** | Git & GitHub |
| **Deployment** | Vercel |

---

# 🏗️ Project Structure

```text
CodeCrafters/
│
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── loading.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── dashboard/
│   ├── landing/
│   ├── ui/
│   └── theme-provider.tsx
│
├── lib/
│   └── glass.ts
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# ⚡ Getting Started

Follow these steps to run CodeCrafters locally.

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Diya030805/CodeCrafters.git
```

## 2️⃣ Navigate to the Project

```bash
cd CodeCrafters
```

## 3️⃣ Install Dependencies

```bash
npm install
```

## 4️⃣ Configure Environment Variables

Create a `.env.local` file in the root directory.

Add the required environment variables used by the project.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ Never commit `.env.local` or any private API keys to GitHub.

## 5️⃣ Start the Development Server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

---

# 🌐 Live Demo

## 🚀 Web Application

**Live Website:**

https://brain-boost-ai-delta.vercel.app/

## 📂 GitHub Repository

**Source Code:**

https://github.com/Diya030805/CodeCrafters

---

# 🔐 Security & Environment Variables

CodeCrafters uses environment variables for external services and API integrations.

Sensitive credentials should **never be committed to the repository**.

Required credentials may include:

- Supabase URL
- Supabase API key
- Gemini API key
- Other required application secrets

For local development, store these values inside `.env.local`.

For production, configure them securely through the deployment platform.

---

# 🚀 Deployment

CodeCrafters is deployed using **Vercel**.

### Deployment Workflow

```text
Development
     ↓
Git
     ↓
GitHub
     ↓
Vercel
     ↓
Production
```

Before submitting a production deployment, verify that:

- The application loads correctly
- Navigation works correctly
- Dashboard works correctly
- AI features work correctly
- Database connectivity works correctly
- Authentication works correctly
- Responsive layouts work correctly
- Production environment variables are configured

---

# 🧪 Main Modules

| Module | Purpose |
|---|---|
| 🤖 **AI Tutor** | Understand concepts with AI assistance |
| 🧠 **Flashcards** | Active recall and revision |
| 📝 **AI Notes** | Create and organize study notes |
| 📅 **Study Planner** | Organize academic tasks |
| 🎯 **Focus Timer** | Maintain focused study sessions |
| 🧩 **AI Quiz** | Test knowledge with AI-generated quizzes |
| 📄 **PDF Analyzer** | Convert documents into learning material |
| 🎙️ **Voice Tutor** | Voice-based conversational learning |
| 📊 **Analytics** | Track learning performance |
| 🏆 **Gamification** | Maintain motivation and consistency |

---

# 🎯 Target Users

CodeCrafters is primarily designed for:

- 🎓 College students
- 📚 School students
- 💻 Computer science learners
- 🧑‍💻 Self-learners
- 📝 Students preparing for exams
- 🚀 Students building consistent study habits

---

# 🌟 Vision

The long-term vision of CodeCrafters is to create a **single intelligent learning ecosystem** where students can understand, practice, plan, focus, and analyze their learning journey from one platform.

> **One Workspace. Smarter Learning. Better Progress.**

---

# 👥 Project

### CodeCrafters

**AI-Powered Learning & Productivity Platform for Students**

Built with modern web technologies and AI to create a more personalized and productive learning experience.

---

## 🔗 Important Links

| Resource | Link |
|---|---|
| 🚀 **Live Demo** | https://brain-boost-ai-delta.vercel.app/ |
| 📂 **GitHub Repository** | https://github.com/Diya030805/CodeCrafters |

---

<p align="center">
  <strong>🚀 Learn Smarter. Stay Focused. Build Better Habits.</strong>
</p>

<p align="center">
  Made with ❤️ for students.
</p>
