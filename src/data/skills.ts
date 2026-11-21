import { SkillCategory } from '../types/portfolio';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    description: 'Core languages verified across LeetCode submissions, Spring Boot services, Flutter apps, and Android codebases.',
    skills: [
      {
        name: 'Java',
        status: 'Used in Projects',
        context: 'Java 22 backend services & 550 LeetCode problems solved',
        projectSlugs: ['talktime', 'quizint', 'notes-fullstack'],
      },
      {
        name: 'Dart',
        status: 'Used in Projects',
        context: 'Cross-platform Flutter client architecture in PrepAI, TalkTime, QuizInt, SkillFirst',
        projectSlugs: ['prepai', 'talktime', 'quizint'],
      },
      {
        name: 'Kotlin',
        status: 'Used in Projects',
        context: 'Native Android apps (TripGo, User Auth, OIBSIP)',
      },
      {
        name: 'SQL',
        status: 'Used in Projects',
        context: 'Relational modeling & 22 SQL problems solved on LeetCode',
        projectSlugs: ['talktime', 'notes-fullstack'],
      },
      {
        name: 'Python',
        status: 'Used in Projects',
        context: 'Django REST backend in devops-assessment & scripting',
        projectSlugs: ['devops-assessment'],
      },
      {
        name: 'C',
        status: 'Coursework',
        context: 'Systems programming & memory fundamentals in B.Tech CSE',
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & API Engineering',
    description: 'Server-side Java ecosystem frameworks used to structure RESTful services, WebSockets, and database access.',
    skills: [
      {
        name: 'Spring Boot 3',
        status: 'Used in Projects',
        context: 'REST controllers, validation, service layers (Java 22, Spring Boot 3.3)',
        projectSlugs: ['talktime', 'quizint', 'notes-fullstack'],
      },
      {
        name: 'WebSockets (STOMP)',
        status: 'Used in Projects',
        context: 'Bidirectional real-time 1-to-1 chat broker in TalkTimeBackend',
        projectSlugs: ['talktime'],
      },
      {
        name: 'Spring Security & Firebase Admin',
        status: 'Used in Projects',
        context: 'Stateless token verification via FirebaseTokenFilter & JWT',
        projectSlugs: ['talktime'],
      },
      {
        name: 'Hibernate / Spring Data JPA',
        status: 'Used in Projects',
        context: 'Entity mapping and repository queries for User, ChatRoom, ChatMessage',
        projectSlugs: ['talktime', 'notes-fullstack'],
      },
      {
        name: 'REST APIs & JSON Validation',
        status: 'Used in Projects',
        context: 'DTO contracts, spring-boot-starter-validation, retry handling',
        projectSlugs: ['quizint', 'talktime', 'devops-assessment'],
      },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    description: 'Containerization, CI/CD automation, and Microsoft Azure cloud fundamentals.',
    skills: [
      {
        name: 'Microsoft Azure',
        status: 'Certified',
        context: 'AZ-900, AI-900, DP-900, SC-900 certified; Azure VM & Static Web Apps deployments',
        projectSlugs: ['devops-assessment', 'azure-terraform-infra', 'spring-boot-cicd'],
      },
      {
        name: 'Docker & Docker Compose',
        status: 'Used in Projects',
        context: 'Multi-container Django + React/Nginx packaging in devops-assessment',
        projectSlugs: ['devops-assessment', 'spring-boot-cicd'],
      },
      {
        name: 'GitHub Actions',
        status: 'Used in Projects',
        context: 'Automated DockerHub build/push and SSH deployment workflows',
        projectSlugs: ['devops-assessment', 'spring-boot-cicd', 'azure-terraform-infra'],
      },
      {
        name: 'Terraform (IaC)',
        status: 'Exploring',
        context: 'Resume-stated modular Azure VNet, VM, Storage & Key Vault provisioning',
        projectSlugs: ['azure-terraform-infra'],
      },
      {
        name: 'Azure Functions & Key Vault',
        status: 'Exploring',
        context: 'Serverless document processing & secret management in Cloud resume projects',
        projectSlugs: ['prepai', 'azure-terraform-infra'],
      },
    ],
  },
  {
    id: 'databases',
    title: 'Databases & Persistence',
    description: 'Relational databases and cloud-backed mobile storage.',
    skills: [
      {
        name: 'MySQL',
        status: 'Used in Projects',
        context: 'Primary relational store via mysql-connector-j in TalkTimeBackend & NotesBackend',
        projectSlugs: ['talktime', 'notes-fullstack'],
      },
      {
        name: 'Firebase Auth & Config',
        status: 'Used in Projects',
        context: 'Identity verification across Flutter mobile apps and Spring Boot Admin SDK',
        projectSlugs: ['talktime', 'prepai'],
      },
      {
        name: 'SQLite',
        status: 'Coursework',
        context: 'Local mobile persistence and SQL coursework',
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Applied Integrations',
    description: 'Structured LLM orchestration, resume intelligence, and domain quiz generation.',
    skills: [
      {
        name: 'Google Gemini API',
        status: 'Used in Projects',
        context: 'Structured JSON quiz generation via Spring Boot REST backend in QuizInt',
        projectSlugs: ['quizint'],
      },
      {
        name: 'Microsoft Azure AI Services',
        status: 'Certified',
        context: 'AI-900 certified; Azure AI Foundry & Document Intelligence workflows in PrepAI',
        projectSlugs: ['prepai'],
      },
      {
        name: 'Prompt Engineering & RAG Concepts',
        status: 'Exploring',
        context: 'Structured schema outputs, ATS scoring prompts, and retrieval grounding',
        projectSlugs: ['prepai', 'quizint'],
      },
    ],
  },
  {
    id: 'frontend-tools',
    title: 'Mobile, Frontend & Tooling',
    description: 'Cross-platform UI frameworks and everyday engineering tools.',
    skills: [
      {
        name: 'Flutter (Riverpod / Provider / Material 3)',
        status: 'Used in Projects',
        context: 'Primary cross-platform mobile framework across PrepAI, TalkTime, QuizInt',
        projectSlugs: ['prepai', 'talktime', 'quizint'],
      },
      {
        name: 'React, TypeScript & Vite',
        status: 'Used in Projects',
        context: 'Frontend container in devops-assessment & modern web interfaces',
        projectSlugs: ['devops-assessment'],
      },
      {
        name: 'Git, GitHub, Maven, IntelliJ & Postman',
        status: 'Used in Projects',
        context: 'Daily version control, Java dependency builds, and REST/WebSocket API testing',
      },
    ],
  },
];
