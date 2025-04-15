# Grading Tool

A SvelteKit application for teachers to create and grade tests, and for students to take tests with automated code grading.

## Features

- Authentication with Supabase (teacher vs student roles)
- Teacher dashboard to create tests (multiple choice and coding)
- Student dashboard to take tests with Monaco code editor
- OpenAI-based code grading
- Fastify backend for code evaluation

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up Supabase:
   - Create a new project in Supabase
   - Create a `users` table with the following schema:
     ```sql
     create table users (
       id uuid references auth.users on delete cascade,
       email text,
       role text check (role in ('teacher', 'student')),
       primary key (id)
     );
     ```
   - Create a `tests` table with the following schema:
     ```sql
     create table tests (
       id uuid default uuid_generate_v4() primary key,
       teacher_id uuid references users(id) on delete cascade,
       title text,
       type text check (type in ('multiple_choice', 'coding')),
       questions jsonb
     );
     ```

5. Start the development servers:
   ```bash
   # Terminal 1 - Frontend
   npm run dev

   # Terminal 2 - Backend
   node server.js
   ```

## Project Structure

- `src/routes/` - SvelteKit routes
  - `+page.svelte` - Home page with authentication
  - `teacher/+page.svelte` - Teacher dashboard
  - `student/+page.svelte` - Student dashboard
- `src/lib/` - Shared components and utilities
  - `components/` - Reusable components
  - `supabase.ts` - Supabase client configuration
- `server.js` - Fastify backend server

## Technologies Used

- SvelteKit
- TypeScript
- TailwindCSS
- Supabase
- Monaco Editor
- Fastify
- OpenAI API
