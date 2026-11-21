import { ProjectItem } from '../types/portfolio';

export const PROJECTS_DATA: ProjectItem[] = [
  {
    slug: 'prepai',
    title: 'PrepAI',
    tagline: 'AI-powered resume analysis and voice mock interview application built with Flutter and Azure AI.',
    shortDescription: 'AI-powered resume intelligence and voice interview preparation app.',
    category: 'AI & Flutter',
    evidenceStatus: 'Verified',
    sourceNote: 'Flutter client (Riverpod, file_picker, audio_io, web_socket_channel) verified in PrepAI repo; Azure Functions & AI agents are resume-stated.',
    featured: true,
    thumbnail: '/src/assets/images/project_prepai_showcase_1795248929151.jpg',
    image: '/src/assets/images/project_prepai_showcase_1795248929151.jpg',
    imageAlt: 'PrepAI mobile application showcase displaying resume analytics and voice waveform UI',
    // Upload recording to public/videos/prepai-demo.mp4 and set video: '/videos/prepai-demo.mp4'
    video: undefined,
    videoDuration: undefined,
    demoAvailable: true,
    problemSolved:
      'Helps students evaluate how well their resumes align with job descriptions and practice structured voice mock interviews.',
    summary:
      'A cross-platform Flutter application built with Riverpod state management, document picking, score indicators, and audio/WebSocket streaming dependencies designed to integrate with Azure Functions and Azure AI Foundry.',
    contribution:
      'Architected the Flutter client with Riverpod across 10+ screens, integrated file picking and audio I/O channels, and structured the 3-agent resume & interview flow.',
    technologies: ['Flutter', 'Riverpod', 'Azure AI Foundry', 'Azure Functions', 'Firebase Auth'],
    keyFeatures: [
      'Resume upload via file_picker with ATS keyword alignment & gap breakdown',
      'Visual match score gauges built with percent_indicator',
      'Voice mock interview audio pipeline using audio_io and web_socket_channel',
      'Predictable async state flows managed with flutter_riverpod',
    ],
    architectureOverview:
      'The Flutter client manages authentication, file upload, and audio capture through Riverpod providers, communicating with serverless Azure Functions and Azure AI Foundry models.',
    architectureNodes: [
      { id: 'c1', label: 'Flutter + Riverpod', role: 'File picker, audio_io capture & score dashboard UI', layer: 'Client' },
      { id: 's1', label: 'Firebase Auth', role: 'Authenticates user sessions', layer: 'Security' },
      { id: 'sv1', label: 'Azure Functions / WS', role: 'Processes uploads & streams interview turns', layer: 'Service' },
      { id: 'a1', label: 'Azure AI Foundry', role: 'Extracts resume structure & scores ATS alignment', layer: 'AI / Cloud' },
    ],
    technicalChallenges: [
      'Coordinating mobile microphone permissions and audio buffers without dropping UI frames.',
      'Structuring multi-step resume feedback so missing keywords and actionable edits remain scannable on mobile.',
    ],
    engineeringDecisions: [
      'Adopted flutter_riverpod over ad-hoc stateful widgets for predictable loading and error states.',
      'Public GitHub currently hosts the Flutter client; serverless Azure Functions backend is documented on the resume.',
    ],
    learnings: [
      'Handling real-time audio I/O and WebSocket state machines in Flutter.',
      'Designing structured JSON evaluation rubrics for resume parsing.',
    ],
    githubUrls: [
      { label: 'View Source (GitHub)', url: 'https://github.com/vishnuvarma681/PrepAI' },
    ],
    playgroundTab: 'prepai',
  },
  {
    slug: 'talktime',
    title: 'TalkTime',
    tagline: 'Real-time 1-to-1 messaging platform powered by Java 22, Spring Boot WebSockets (STOMP), and MySQL.',
    shortDescription: 'Real-time 1-to-1 chat system with Spring Boot WebSockets and Flutter.',
    category: 'Java Backend',
    evidenceStatus: 'Verified',
    sourceNote: 'Verified via TalkTimeBackend (Java 22, Spring Boot 3.3.1 pom.xml) & TalkTime (Flutter) repositories.',
    featured: true,
    thumbnail: '/src/assets/images/project_talktime_showcase_1795248928875.jpg',
    image: '/src/assets/images/project_talktime_showcase_1795248928875.jpg',
    imageAlt: 'TalkTime architecture visualization showing two devices exchanging encrypted WebSocket messages',
    video: undefined,
    videoDuration: undefined,
    demoAvailable: true,
    problemSolved:
      'Delivers low-latency bidirectional 1-to-1 messaging with durable relational history and verified user identity without HTTP polling.',
    summary:
      'A decoupled full-stack chat platform pairing a Java 22 / Spring Boot 3.3 backend (TalkTimeBackend) with a Flutter client (TalkTime). Uses STOMP over WebSockets for real-time delivery, Firebase Admin SDK for token verification, and MySQL via JPA/Hibernate.',
    contribution:
      'Designed the Spring Boot backend packages (config, controller, dto, model, repository, security), implemented FirebaseTokenFilter for authenticated access, and built the Flutter messaging UI.',
    technologies: ['Java 22', 'Spring Boot', 'WebSockets (STOMP)', 'MySQL', 'Flutter'],
    keyFeatures: [
      'Bidirectional 1-to-1 messaging via Spring WebSocket STOMP broker',
      'Stateless identity verification via FirebaseTokenFilter and UserPrincipal',
      'Normalized JPA entities for User, ChatRoom, and ChatMessage in MySQL',
      'REST controllers for user sync and conversation history',
    ],
    architectureOverview:
      'Flutter signs users in with Firebase Auth and passes the ID token to Spring Boot. Spring Security verifies tokens via FirebaseTokenFilter before authorizing REST history queries and STOMP WebSocket sessions.',
    architectureNodes: [
      { id: 'c1', label: 'Flutter Client', role: 'Sends Firebase ID token & STOMP frames', layer: 'Client' },
      { id: 's1', label: 'FirebaseTokenFilter', role: 'Verifies JWT via Firebase Admin SDK 9.3.0', layer: 'Security' },
      { id: 'sv1', label: 'ChatController & STOMP', role: 'Routes 1-to-1 WebSocket messages & history', layer: 'Service' },
      { id: 'd1', label: 'MySQL + JPA/Hibernate', role: 'Persists User, ChatRoom & ChatMessage entities', layer: 'Data' },
    ],
    apiFlow: [
      '1. Client signs in with Firebase Auth and obtains an ID token.',
      '2. POST /api/auth/sync syncs user profile via SyncUserRequest DTO.',
      '3. Client establishes WebSocket handshake at configured STOMP endpoint.',
      '4. Outbound MessageDto routes through Spring message broker and persists to MySQL.',
    ],
    databaseSchema: [
      { table: 'users', columns: ['id (PK)', 'firebase_uid (UNIQUE)', 'display_name', 'email', 'created_at'] },
      { table: 'chat_rooms', columns: ['id (PK)', 'room_key', 'participant_one_id (FK)', 'participant_two_id (FK)'] },
      { table: 'chat_messages', columns: ['id (PK)', 'chat_room_id (FK)', 'sender_id (FK)', 'content', 'sent_at'] },
    ],
    technicalChallenges: [
      'Aligning WebSocket and REST security filters so unauthenticated clients cannot spoof sender identities.',
      'Modeling deterministic 1-to-1 ChatRoom keys so participants always resolve to the same conversation thread.',
    ],
    engineeringDecisions: [
      'Isolated Firebase token validation inside a dedicated Spring Security filter rather than repeating checks in controllers.',
      'Separated API payloads (MessageDto, SyncUserRequest) from JPA entities.',
    ],
    learnings: [
      'Managing stateful WebSocket session lifecycles alongside stateless REST endpoints in Spring Boot.',
      'Designing clean Hibernate relationships backed by MySQL.',
    ],
    githubUrls: [
      { label: 'Backend (Spring Boot)', url: 'https://github.com/vishnuvarma681/TalkTimeBackend' },
      { label: 'Frontend (Flutter)', url: 'https://github.com/vishnuvarma681/TalkTime' },
    ],
    playgroundTab: 'talktime',
  },
  {
    slug: 'quizint',
    title: 'QuizInt',
    tagline: 'Domain-specific AI interview quiz app backed by a Spring Boot REST proxy with schema validation and retries.',
    shortDescription: 'Domain-specific AI quiz app with a Spring Boot Gemini proxy.',
    category: 'Java Backend',
    evidenceStatus: 'Verified',
    sourceNote: 'Verified via QuizInt_Backend (Java 22, Spring Boot 3.3.0) and QuizInt (Flutter) repositories.',
    featured: true,
    thumbnail: '/src/assets/images/project_quizint_showcase_1795250500204.jpg',
    image: '/src/assets/images/project_quizint_showcase_1795250500204.jpg',
    imageAlt: 'QuizInt Material 3 mobile application displaying an algorithms countdown quiz screen',
    video: undefined,
    videoDuration: undefined,
    demoAvailable: true,
    problemSolved:
      'Keeps LLM API keys off mobile clients while preventing malformed generative AI JSON responses from crashing quiz UIs.',
    summary:
      'A decoupled interview preparation platform. QuizInt_Backend exposes validated Spring Boot REST endpoints (QuizController, QuizGenerationService) that call the Gemini API, parse structured JSON into QuestionDTO objects with retry logic, and serve a Flutter Material 3 client.',
    contribution:
      'Built both the Spring Boot REST API (QuizController, DTOs, QuizGenerationService) and the Flutter Material 3 frontend using Provider state management and countdown timers.',
    technologies: ['Java 22', 'Spring Boot', 'Gemini API', 'Flutter', 'Provider'],
    keyFeatures: [
      'Server-side Spring Boot proxy keeping Gemini API keys off client devices',
      'Validated QuizRequest / QuestionDTO contracts via spring-boot-starter-validation',
      'JSON extraction and retry handling in QuizGenerationService',
      'Responsive Material 3 UI with countdown timers and score tracking',
    ],
    architectureOverview:
      'Flutter + Provider sends validated quiz requests to Spring Boot, where QuizGenerationService queries Gemini, parses and retries malformed JSON payloads, and returns clean QuestionDTO lists.',
    architectureNodes: [
      { id: 'c1', label: 'Flutter + Provider', role: 'Topic selection, countdown timer & score view', layer: 'Client' },
      { id: 'sv1', label: 'QuizController (Spring Boot)', role: 'Validates QuizRequest & enforces DTO contract', layer: 'Service' },
      { id: 'sv2', label: 'QuizGenerationService', role: 'Calls Gemini API with JSON parsing & retry logic', layer: 'Service' },
      { id: 'a1', label: 'Google Gemini API', role: 'Generates domain-specific MCQ questions', layer: 'AI / Cloud' },
    ],
    apiFlow: [
      '1. Flutter client sends POST /api/quiz/generate with QuizRequest (topic, difficulty, count).',
      '2. Spring Validation verifies request constraints.',
      '3. QuizGenerationService invokes Gemini API and parses response into List<QuestionDTO>.',
      '4. Client renders timed Material 3 quiz cards and calculates final score.',
    ],
    technicalChallenges: [
      'Handling LLM responses wrapped in markdown fences or missing fields without crashing client parsing.',
      'Synchronizing countdown timers with Provider state changes cleanly.',
    ],
    engineeringDecisions: [
      'Centralized all Gemini API calls inside Spring Boot instead of embedding keys in Flutter.',
      'Defined strongly typed Java DTOs so AI provider updates stay isolated from the mobile UI.',
    ],
    learnings: [
      'Defensive JSON parsing and retry resilience in strongly typed Java REST services.',
      'Clean client-server separation with Flutter Provider.',
    ],
    githubUrls: [
      { label: 'Backend (Spring Boot)', url: 'https://github.com/vishnuvarma681/QuizInt_Backend' },
      { label: 'Frontend (Flutter)', url: 'https://github.com/vishnuvarma681/QuizInt' },
    ],
    playgroundTab: 'quizint',
  },
  {
    slug: 'devops-assessment',
    title: 'Containerized CI/CD & Azure VM Deployment',
    tagline: 'Dockerized Django and React/Nginx stack automated from GitHub push to Azure VM via GitHub Actions.',
    shortDescription: 'Multi-container Docker Compose & GitHub Actions deployment to Azure VM.',
    category: 'Cloud & DevOps',
    evidenceStatus: 'Verified',
    sourceNote: 'Verified via devops-assessment repo (Dockerfile, docker-compose.yml, frontend/nginx.conf, .github/workflows/ci-cd.yml).',
    featured: true,
    thumbnail: '/src/assets/images/project_cloud_terraform_1795248928060.jpg',
    image: '/src/assets/images/project_cloud_terraform_1795248928060.jpg',
    imageAlt: 'Modular cloud infrastructure visualization showing container nodes, network subnets, and vault',
    video: undefined,
    videoDuration: undefined,
    demoAvailable: true,
    problemSolved:
      'Eliminates manual SSH builds and environment drift across multi-service web deployments.',
    summary:
      'A containerized full-stack project combining a Django REST backend and a React + Vite TypeScript frontend served through Nginx. Orchestrated via Docker Compose on an isolated bridge network with automated GitHub Actions CI/CD.',
    contribution:
      'Wrote the backend and frontend Dockerfiles, Nginx configuration, docker-compose networking setup, and the automated GitHub Actions build-and-deploy workflow.',
    technologies: ['Docker', 'Docker Compose', 'GitHub Actions', 'Nginx', 'Azure VM'],
    keyFeatures: [
      'Multi-container orchestration via docker-compose.yml on a dedicated bridge network',
      'Automated DockerHub image builds & pushes triggered on main branch commits',
      'Remote Azure VM redeployment over SSH with pull/down/up lifecycle',
      'Production React static bundle served by Nginx',
    ],
    architectureOverview:
      'Pushing to main triggers GitHub Actions to build and push backend and frontend images to DockerHub, then SSH into an Azure VM to pull updated images and restart the Compose stack.',
    architectureNodes: [
      { id: 'c1', label: 'GitHub Push (main)', role: 'Triggers ci-cd.yml workflow', layer: 'Client' },
      { id: 'sv1', label: 'GitHub Actions', role: 'Builds & pushes Django and React Docker images', layer: 'Service' },
      { id: 'a1', label: 'DockerHub Registry', role: 'Stores versioned backend & frontend images', layer: 'AI / Cloud' },
      { id: 'd1', label: 'Azure VM + Compose', role: 'Pulls images & runs Nginx + Django containers', layer: 'Data' },
    ],
    technicalChallenges: [
      'Configuring CORS and container networking across separate service ports.',
      'Keeping deployment credentials securely isolated inside GitHub Encrypted Secrets.',
    ],
    engineeringDecisions: [
      'Served the production React bundle via Nginx rather than running a dev server inside the container.',
      'Isolated containers on a named Docker Compose bridge network (app-network).',
    ],
    learnings: [
      'Multi-container port mapping, Nginx proxying, and automated SSH-based CD pipelines.',
    ],
    githubUrls: [
      { label: 'View Source (GitHub)', url: 'https://github.com/vishnuvarma681/devops-assessment' },
    ],
    playgroundTab: 'cicd',
  },
  {
    slug: 'azure-terraform-infra',
    title: 'Azure Infrastructure Automation (Terraform)',
    tagline: 'Modular Infrastructure-as-Code design for Azure networking, compute, storage, and Key Vault.',
    shortDescription: 'Modular Terraform IaC architecture for Azure VNet, NSGs, and Key Vault.',
    category: 'Cloud & DevOps',
    evidenceStatus: 'Resume-Stated',
    sourceNote: 'Stated on Cloud Engineering resume; public Terraform repository is not currently hosted on GitHub.',
    featured: false,
    thumbnail: '/src/assets/images/project_cloud_terraform_1795248928060.jpg',
    image: '/src/assets/images/project_cloud_terraform_1795248928060.jpg',
    imageAlt: 'Azure Terraform architecture illustration',
    demoAvailable: true,
    problemSolved:
      'Replaces manual portal provisioning with repeatable, version-controlled Azure infrastructure and centralized secrets.',
    summary:
      'Modular Terraform architecture covering Azure Virtual Networks, Subnets, Network Security Groups, Compute, Storage, and Azure Key Vault with remote state and GitHub Actions automation.',
    contribution:
      'Designed reusable HCL modules, remote state configuration, and Key Vault secret references described on the Cloud Engineering resume.',
    technologies: ['Terraform', 'Microsoft Azure', 'Azure Key Vault', 'GitHub Actions'],
    keyFeatures: [
      'Reusable Terraform modules separated by networking, compute, storage, and database tiers',
      'Remote Terraform state storage for consistent deployments',
      'Azure Key Vault integration to avoid plaintext secrets in variables',
      'GitHub Actions workflow for validate, plan, and apply checks',
    ],
    architectureOverview:
      'Modular Terraform configurations define an isolated Azure Virtual Network segmented into application and data subnets protected by Network Security Groups and backed by Key Vault.',
    architectureNodes: [
      { id: 'c1', label: 'GitHub Actions', role: 'Runs fmt, validate, plan & apply', layer: 'Client' },
      { id: 's1', label: 'Key Vault & NSGs', role: 'Protects secrets & enforces subnet traffic rules', layer: 'Security' },
      { id: 'sv1', label: 'VNet & Load Balancer', role: 'Routes traffic across compute tier', layer: 'Service' },
      { id: 'd1', label: 'Storage & Database', role: 'Hosts remote tfstate & persistent data', layer: 'Data' },
    ],
    technicalChallenges: [
      'Preventing state file conflicts and keeping sensitive credentials out of version control.',
    ],
    engineeringDecisions: [
      'Structured infrastructure into composable modules rather than one monolithic configuration.',
    ],
    learnings: [
      'State locking, module dependencies, and network segmentation in Microsoft Azure.',
    ],
    githubUrls: [
      { label: 'GitHub Profile', url: 'https://github.com/vishnuvarma681?tab=repositories' },
    ],
    playgroundTab: 'terraform',
  },
  {
    slug: 'notes-fullstack',
    title: 'NotesApp & NotesBackend',
    tagline: 'Flutter CRUD client integrated with a Spring Boot Maven REST API and MySQL database.',
    shortDescription: 'Flutter notes client connected to Spring Boot and MySQL.',
    category: 'Java Backend',
    evidenceStatus: 'Verified',
    sourceNote: 'Verified via NotesApp (Flutter) and NotesBackend (Java / Spring Boot Maven) repositories.',
    featured: false,
    demoAvailable: false,
    problemSolved:
      'Connects a cross-platform mobile client cleanly to a relational MySQL database through a Spring Boot REST API.',
    summary:
      'A full-stack CRUD application pairing a Flutter UI (NotesApp) with a Spring Boot Maven backend (NotesBackend) persisting notes in MySQL.',
    contribution:
      'Implemented the Spring Boot REST endpoints, MySQL persistence, and Flutter HTTP client screens.',
    technologies: ['Java', 'Spring Boot', 'MySQL', 'Flutter', 'Maven'],
    keyFeatures: [
      'Full Create, Read, Update, Delete REST endpoints in Spring Boot',
      'MySQL relational persistence',
      'Flutter client consuming JSON endpoints over HTTP',
    ],
    architectureOverview:
      'Flutter client dispatches HTTP JSON requests to Spring Boot REST controllers, which persist and retrieve note records from MySQL.',
    architectureNodes: [
      { id: 'c1', label: 'Flutter (NotesApp)', role: 'Displays & edits notes via HTTP', layer: 'Client' },
      { id: 'sv1', label: 'Spring Boot (NotesBackend)', role: 'Handles REST CRUD routes', layer: 'Service' },
      { id: 'd1', label: 'MySQL', role: 'Stores persistent note records', layer: 'Data' },
    ],
    technicalChallenges: [
      'Handling Android emulator localhost networking and HTTP status error mapping in Flutter.',
    ],
    engineeringDecisions: [
      'Used Spring Boot Maven wrapper (mvnw) for reproducible Java builds.',
    ],
    learnings: [
      'Connecting Flutter clients with Java REST APIs and relational schemas.',
    ],
    githubUrls: [
      { label: 'Backend (NotesBackend)', url: 'https://github.com/vishnuvarma681/NotesBackend' },
      { label: 'Frontend (NotesApp)', url: 'https://github.com/vishnuvarma681/NotesApp' },
    ],
  },
];
