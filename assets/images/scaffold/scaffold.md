# Scaffold AI Platform — Architecture, Technical Deep-Dive & System Blueprint

> **Portfolio Technical Documentation**
> **Project**: Scaffold AI Platform (Scaffold Backend & Scaffold Frontend)
> **Author & Lead Architect**: Suleman Khan
> **Repository Location**: `d:/RIVON/Projects/scaffold`
> **Target Audience**: Technical Recruiters, Engineering Managers, System Architects, & AI Developers

---

## 1. Executive Summary

**Scaffold AI** is a production-grade, enterprise-ready multi-agent orchestration and visual creative AI playground platform. Designed to bridge high-throughput asynchronous AI execution with a intuitive visual node-graph interface, Scaffold enables creative technologists, agencies, and enterprise clients to construct, chain, execute, and monitor multi-modal AI workflows (combining LLM text generation, image synthesis, video generation, and audio processing) at scale.

Key highlights of Scaffold's backend and platform architecture:

- **Graph-Based Visual Engine**: Powered by an extensible Node Executor DAG engine built with custom executors, LangGraph state machines, and `@xyflow/react` graph rendering.
- **Multimodal AI Pipeline**: Seamlessly integrates Google Gemini 2.5/3.0 LLMs via LangChain, FAL AI cloud endpoints (Flux, Luma, Wan, Stable Diffusion, ElevenLabs), and custom prompt chains.
- **Enterprise Credit & Ledger System**: Real-time per-execution credit consumption calculation, user balance validation, and auditable financial transaction logging for AI compute billing.
- **Hybrid Security & RBAC**: Dual-layer authentication combining Supabase JWT verification with FastAPI middleware enforcement across `admin`, `creative`, and `client` account roles.
- **High-Performance Asynchronous Compute**: Asynchronous non-blocking architecture utilizing FastAPI, AsyncIO, Celery task workers, Redis message brokers, and Supabase PostgreSQL with pool management.

---

## 2. System Architecture Overview

Scaffold is structured as a decoupled full-stack monorepo featuring a **FastAPI Microservices Backend** (`scaffold-backend`) and a **Next.js 16 React 19 Frontend** (`scaffold-frontend`).

```mermaid
flowchart TB
    subgraph ClientLayer["Frontend Layer (Next.js 16 App Router)"]
        UI["React 19 + Tailwind CSS v4"]
        GraphUI["@xyflow/react (Visual Node Graph Editor)"]
        DagreEngine["Dagre Auto-Layout Engine"]
    end

    subgraph APIGateway["Backend API Gateway (FastAPI + Uvicorn)"]
        Router["API Router (/api/v1)"]
        AuthMiddleware["JWT Auth & RBAC Middleware"]
        RateLimiter["SlowAPI Rate Limiter"]
    end

    subgraph CoreEngine["Creative Playground Engine"]
        DAGEngine["Workflow DAG Execution Engine"]
        NodeRegistry["Node Executor Registry"]
      
        subgraph Executors["Custom Node Executors"]
            InputExec["Input Node"]
            TextExec["Text / LLM (Gemini)"]
            ImgExec["Image Synth (FAL AI / Flux)"]
            VidExec["Video Synth (Luma / Wan)"]
            AudExec["Audio Synth (ElevenLabs)"]
            ReviewExec["Human-in-the-Loop Review"]
        end
    end

    subgraph ServiceLayer["Services & Business Logic"]
        UserService["User & Auth Service"]
        AgentService["Agent & Blueprint Service"]
        CostService["Credit & Pricing Ledger"]
        VectorService["Pinecone Vector Index Service"]
    end

    subgraph StorageLayer["Data & Persistence Layer"]
        SupaDB[("Supabase PostgreSQL\n(UUID v7, JSONB, RLS)")]
        RedisCache[("Redis 7 Broker\n& Celery Result Backend")]
        PineconeDB[("Pinecone Vector DB\n(Semantic Asset Embeddings)")]
        StorageBucket[("Supabase Storage / S3\n(Media Asset CDN)")]
    end

    subgraph ExternalAI["External Cloud AI Infrastructure"]
        FalAI["FAL AI Compute Cloud"]
        GeminiAI["Google Gemini AI API"]
    end

    UI --> Router
    GraphUI --> Router
    Router --> AuthMiddleware --> RateLimiter
    RateLimiter --> ServiceLayer
    RateLimiter --> DAGEngine

    DAGEngine --> NodeRegistry --> Executors
    Executors --> FalAI
    Executors --> GeminiAI

    ServiceLayer --> SupaDB
    ServiceLayer --> VectorService --> PineconeDB
    CostService --> SupaDB
    DAGEngine --> RedisCache
    Executors --> StorageBucket
```

---

## 3. Technology Stack Breakdown

| Layer                           | Primary Technology                  | Description & Usage                                                                 |
| :------------------------------ | :---------------------------------- | :---------------------------------------------------------------------------------- |
| **Language & Runtime**    | Python 3.12+                        | High-performance type-hinted Python runtime powering backend microservices          |
| **Web Framework**         | FastAPI 0.109+                      | Asynchronous RESTful API framework with automatic OpenAPI/Swagger spec generation   |
| **Frontend Framework**    | Next.js 16 (App Router), React 19   | Server and Client Component architecture with React 19 Concurrent Features          |
| **Graph & Canvas UI**     | `@xyflow/react` v12, Dagre        | Interactive node-based canvas editor with automatic DAG graph auto-layout           |
| **Styling & Components**  | Tailwind CSS v4, HeroUI, Radix UI   | Modern dark glassmorphism design system with responsive layouts                     |
| **Database & Auth**       | Supabase PostgreSQL, Supabase Auth  | Relational DB with UUID v7 primary keys, JSONB metadata, RLS, and GoTrue Auth       |
| **ORM & Database Driver** | SQLAlchemy 2.0, Alembic, Psycopg2   | Type-safe SQL ORM with Alembic migration versioning                                 |
| **AI & LLM Framework**    | LangChain, LangGraph, Google Gemini | Agent state-machine orchestration and LLM prompt generation                         |
| **Multimodal Synthesis**  | FAL AI SDK (`fal-client`)         | Cloud GPU execution for Flux, Stable Diffusion, Luma Dream Machine, and Wan Video   |
| **Async Task Queue**      | Celery 5.3, Redis 7                 | Distributed background job worker queue for long-running media generation pipelines |
| **Vector Database**       | Pinecone Vector Database            | High-dimensional embedding storage for semantic agent search and media retrieval    |
| **Rate Limiting & Audit** | SlowAPI, Honeybadger, SendGrid      | Request throttling, error monitoring/alerting, and transactional email service      |

---

## 4. Deep-Dive: Core Backend Subsystems & Workflows

### 4.1 FastAPI API Gateway & Service Separation

The backend architecture is strictly organized according to clean software engineering principles, separating concern between routing, services, repositories, and data models:

```
scaffold-backend/
├── app/
│   ├── api/v1/endpoints/    # REST Route Controllers (admin, agents, auth, creative, workflows)
│   ├── core/                # Security, rate limiting, and config loading
│   ├── database/            # Supabase & SQLAlchemy connection pooling
│   ├── models/              # SQLAlchemy Data Models (User, Agent, Project, etc.)
│   ├── repositories/        # Repository Pattern Database Access Layer
│   ├── schemas/             # Pydantic Request/Response Validation Schemas
│   └── services/            # Core Domain Business Logic
└── creative-playground/
    └── app/
        ├── agents/          # LangGraph Agent State Definitions
        ├── engine/          # Workflow Execution Engine & Custom Executors
        ├── pricing/         # Real-time Cost & Credit Ledger Calculation
        └── workflows/       # Graph DAG Parsing & Topological Sorters
```

#### Key Endpoints Summary:

- `/api/v1/auth`: Registration, login, session validation, password reset, role retrieval.
- `/api/v1/agents`: Agent CRUD, blueprint instantiations, agent invocation endpoints.
- `/api/v1/workflows`: Graph workflow creation, validation, topological sorting, and asynchronous execution triggers.
- `/api/v1/creative`: Direct creative generation endpoints for image, video, text, and audio.
- `/api/v1/admin`: System metrics, credit package adjustments, user management, audit logs.

---

### 4.2 Creative Playground Execution Engine

The **Creative Playground** is the core innovation of Scaffold. It transforms a visual graph of connected nodes into an asynchronous execution DAG (Directed Acyclic Graph).

```mermaid
sequenceDiagram
    autonumber
    actor User as Creative User
    participant Canvas as Next.js Canvas UI (@xyflow/react)
    participant API as FastAPI Gateway
    participant Ledger as Credit Ledger Service
    participant Engine as Workflow DAG Engine
    participant Registry as Executor Registry
    participant AI as FAL AI / Gemini Cloud
    participant DB as Supabase DB

    User->>Canvas: Connect Nodes & Click "Run Workflow"
    Canvas->>API: POST /api/v1/workflows/{id}/execute (JSON Graph Payload)
    API->>Ledger: Validate User Credit Balance
    alt Insufficient Credits
        Ledger-->>API: Reject Request (402 Payment Required)
        API-->>Canvas: Display "Insufficient Credits" Notification
    else Sufficient Credits
        Ledger->>DB: Reserve Credits (Pending Transaction)
        API->>Engine: Initialize Graph Engine (Nodes & Edges)
        Engine->>Engine: Perform Topological Sort & Dependency Resolve
      
        loop For Each Executable Node
            Engine->>Registry: Fetch Executor for Node Type
            Registry->>AI: Dispatch Async Request (Image / Video / LLM)
            AI-->>Registry: Return Media Asset URL & Execution Time
            Engine->>Engine: Store Node Output in State Context
        end

        Engine->>Ledger: Calculate Final Compute Cost & Deduct Credits
        Engine->>DB: Save Workflow Execution History & Node Logs
        Engine-->>API: Execution Result (Outputs & Artifacts)
        API-->>Canvas: Stream Live Output Updates & Render Preview
    end
```

#### Node Executor Architecture (`creative-playground/app/engine/executors/`)

Every node on the visual canvas corresponds to a typed `BaseExecutor`:

1. **`InputExecutor`**: Receives initial user inputs (prompts, source images, aspect ratios, target resolutions).
2. **`TextGeneratorExecutor`**: Invokes Google Gemini via LangChain to generate dynamic prompts, copy, or scripts.
3. **`ImageGeneratorExecutor`**: Calls FAL AI endpoints (`fal-ai/flux/schnell`, `fal-ai/flux/dev`) with custom guidance scales, seeds, and image sizes.
4. **`VideoGeneratorExecutor`**: Triggers image-to-video or text-to-video synthesis via FAL AI (`luma-dream-machine`, `wan-video`), returning playable MP4/WebM video streams.
5. **`AudioGeneratorExecutor`**: Generates natural voiceovers or audio tracks via ElevenLabs integration.
6. **`UserReviewExecutor`**: Supports **Human-in-the-Loop (HITL)** interaction. Pauses execution flow until an admin or creative user approves or provides manual input feedback.

---

### 4.3 Credit Accounting & Cost Ledger System

To prevent unmetered AI compute consumption, Scaffold incorporates a dynamic credit metering engine (`creative-playground/app/pricing/` and `app/repositories/user_cost_repository.py`).

- **Pre-execution Verification**: Before executing a workflow or agent, Scaffold calculates the maximum estimated cost based on selected models (e.g., Flux Schnell = 1 credit, Luma Video = 5 credits).
- **Post-execution Ledger Settlement**: Upon completion, the exact execution duration and model pricing tier are converted to credits and recorded as a line item in `user_cost_logs`.

```python
# Sample credit deduction logic flow
cost_per_second = MODEL_PRICING_TIERS[node.model_id]
total_credits = math.ceil(execution_duration * cost_per_second)
user_repository.deduct_credits(user_id=current_user.id, credits=total_credits)
```

---

### 4.4 Database Schema Design & Best Practices

Scaffold leverages **Supabase PostgreSQL** optimized for scalable SaaS applications:

#### Key Architectural Database Highlights:

1. **UUID v7 Primary Keys**: All core tables (`users`, `agents`, `blueprints`, `workflows`) use time-ordered UUID v7 (`uuid_generate_v7()`), ensuring sequential index locality and high write throughput.
2. **Hybrid Rigid & Dynamic Columns**: Frequently queried indexed fields (e.g., `email`, `account_type`, `is_admin`, `created_at`) exist as standard relational columns, while dynamic metadata is stored in Postgres `JSONB` (`data`, `meta_data`).
3. **Soft Deletes**: Deletion operations populate `deleted_at` and `deleted_by_user_id` without destroying historical audit data.

```sql
-- Core User Schema Definition
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    public_id VARCHAR(20) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) NOT NULL DEFAULT 'client',
    account_status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_client BOOLEAN NOT NULL DEFAULT TRUE,
    is_creative BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    data JSONB DEFAULT '{}'::jsonb,
    meta_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

---

## 5. Visual UI/UX & Platform Showcase

The platform features a modern responsive UI designed for creative workflows across desktop and mobile form factors.

### 5.1 Main Dashboard & Analytics

The primary dashboard provides real-time metrics on active agent executions, credit balances, and recent workflow runs.

|            Desktop View            |                 Mobile View                 |
| :--------------------------------: | :------------------------------------------: |
| ![Dashboard Desktop](dashoard.png) | ![Dashboard Mobile](phone-view/dashoard.png) |

---

### 5.2 Agent Blueprints & Workflow Templates

Users can browse pre-configured AI Agent Blueprints or construct custom DAG templates.

|      Desktop Blueprints Catalog      |    Single Blueprint Detail & Execution    |
| :-----------------------------------: | :---------------------------------------: |
| ![Blueprints Desktop](blueprints.png) | ![Single Blueprint](single-blueprint.png) |

|             Mobile Blueprints View             |                Mobile Single Blueprint View                |
| :---------------------------------------------: | :---------------------------------------------------------: |
| ![Blueprints Mobile](phone-view/blueprints.png) | ![Single Blueprint Mobile](phone-view/single-blueprint.png) |

---

### 5.3 Agent Management & Execution Interface

Manage deployed agents, monitor node execution states, and view generated media outputs.

|     My Deployed Agents     |      Agent Workspace & Node Execution      |
| :-------------------------: | :-----------------------------------------: |
| ![My Agents](my-agents.png) | ![Single Agent Interface](single-agent.png) |

|              Mobile Agents View              |         Mobile Dashboard Secondary View         |
| :-------------------------------------------: | :----------------------------------------------: |
| ![My Agents Mobile](phone-view/my-agents.png) | ![Dashboard 2 Mobile](phone-view/dashoard-2.png) |

---

### 5.4 Backend Infrastructure & API OpenAPI Documentation

Interactive Swagger documentation for developers and full backend architectural overview.

| OpenAPI / Swagger Documentation (`/docs`) |      Backend Service & Node Architecture      |
| :-----------------------------------------: | :-------------------------------------------: |
|        ![Swagger Docs](swagger.png)        | ![Backend Architecture](scaffold-backend.png) |

| User Profile & Account Settings |
| :-----------------------------: |
|  ![User Profile](profile.png)  |

---

## 6. Engineering Best Practices & Workflows

### 6.1 Clean Architecture & Repository Pattern

To maintain a high standard of software engineering, Scaffold strictly decouples database access from HTTP route handlers:

- **Controllers (`app/api/v1/endpoints/`)**: Validate request payloads using Pydantic, inspect auth context, and invoke domain services.
- **Domain Services (`app/services/`)**: Enforce business rules, credit checks, and cross-service communication.
- **Repositories (`app/repositories/`)**: Abstract database SQL queries, providing typed `get_by_id`, `get_by_field`, `create`, `update`, and `delete` methods.

### 6.2 Resilient Error Handling & Monitoring

- **Graceful Fallbacks**: If a primary FAL AI model endpoint experiences latency or downtime, the Node Executor automatically attempts retries with secondary model fallbacks.
- **Honeybadger DSN Logging**: Runtime exceptions and unhandled exceptions are captured asynchronously and pushed to Honeybadger.
- **Account Lockout Security**: Failed login attempts increment `failed_login_attempts`. Reaching the threshold locks the account temporarily (`locked_until`), preventing brute-force authentication attacks.

### 6.3 Development & Verification Workflow

- **Local Environment Setup**: Managed via virtual environments and containerized Redis dependencies.
- **Database Migrations**: Handled via Alembic schema revision files located in `alembic/versions/`.
- **Testing**: Automated integration and unit testing suite powered by `pytest` and `pytest-asyncio`.

---

## 7. Summary & Portfolio Key Takeaways

Scaffold demonstrates advanced software engineering capability across full-stack architecture, asynchronous system design, and AI model orchestration:

1. **Production AI Integration**: Real-world integration of cutting-edge multimodal generative AI models (FAL AI, Gemini, LangChain, LangGraph).
2. **Scalable System Design**: Asynchronous FastAPI backend coupled with Redis/Celery background task execution and Supabase PostgreSQL.
3. **Complex Frontend Engineering**: Reactive Next.js 16 frontend featuring visual graph DAG canvas execution via `@xyflow/react` and Dagre auto-layout algorithms.
4. **Enterprise SaaS Features**: Granular Role-Based Access Control (RBAC), real-time credit consumption calculation, audit logging, and security lockout protection.

---

*Documentation compiled for Scaffold Portfolio Showcase.*
