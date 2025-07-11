# LiveNovel-PathRAG Architecture Overview

This document outlines the high-level architecture of the LiveNovel-PathRAG project, detailing the roles of the frontend and backend components and how they interact.

## High-Level Architecture

The project is structured as a **monorepo** containing two primary, distinct applications:

1.  **Python Backend**: A **FastAPI** application that serves as the core engine for the entire system. It handles the main application logic, user authentication, document processing, and the advanced Retrieval-Augmented Generation (RAG) capabilities via the `PathRAG` library.
2.  **SvelteKit Frontend**: A modern web application built using the **Vercel AI Chatbot template**. It is responsible for all user-facing interfaces, including the chat UI, user settings, and document management views.

These two applications run independently but are designed to communicate with each other via a standard REST API.

---

## Backend (`/api`, `/PathRAG`, `main.py`)

The backend is the "brain" of the operation.

* **Technology**: Built with Python and the **FastAPI** framework.
* **Core Logic**: It uses the custom **`PathRAG`** library to manage a knowledge graph, process documents, and generate contextual responses for the chat.
* **Database**: It uses **SQLAlchemy** to interact with a SQLite database (`pathrag.db`) for storing user data, chat threads, and document metadata.
* **Authentication**: Manages user registration and login via JWT (JSON Web Tokens).
* **API Endpoints**: Exposes all functionality through REST endpoints found in the `/api/features` directory, such as `/chats`, `/documents`, and `/users`.

---

## Frontend (`/frontend`)

The frontend is the user's window into the system.

* **Technology**: A **SvelteKit** application based on the Vercel AI Chatbot template.
* **AI SDK**: It uses the **Vercel AI SDK** to handle streaming AI responses and provides a flexible interface for swapping out different language models (like Google Gemini, xAI, etc.).
* **Database**: For its *own* needs (like managing UI state or user-specific data separate from the main backend), it uses **Drizzle ORM** to connect to a **Vercel Postgres** database.
* **Configuration**: The frontend is configured via a **`.env.local`** file. This file is not meant to be created manually. It should be generated by linking the project to Vercel and running `vercel env pull`.

---

## Interaction and Data Flow

1.  A user interacts with the SvelteKit UI in their browser.
2.  The frontend makes an API call to the FastAPI backend (e.g., sending a chat message to a `/chats/...` endpoint).
3.  The FastAPI backend receives the request, uses the `PathRAG` library to process it and generate a response.
4.  The backend sends the response back to the frontend.
5.  The Vercel AI SDK on the frontend receives the response (often as a stream) and displays it in the chat window.

This separation of concerns allows the backend to focus entirely on the complex AI and data logic, while the frontend can focus on providing a fast and responsive user experience.