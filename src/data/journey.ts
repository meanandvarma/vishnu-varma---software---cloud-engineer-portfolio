import { JourneyMilestone } from '../types/portfolio';

export const JOURNEY_DATA: JourneyMilestone[] = [
  {
    id: 'journey-1',
    title: 'Java Backend & Real-Time Messaging Architecture',
    timeframe: 'Completed · Jul 2026',
    status: 'Completed',
    description:
      'Built TalkTimeBackend and QuizInt_Backend in Java 22 & Spring Boot 3.3, implementing WebSocket STOMP messaging, Firebase Admin JWT filters, Spring Security, and JPA/Hibernate MySQL persistence.',
    tags: ['Java 22', 'Spring Boot 3.3', 'WebSockets', 'MySQL'],
  },
  {
    id: 'journey-2',
    title: 'Containerized CI/CD & Azure Cloud Workflows',
    timeframe: 'Completed · Jan – Sep 2026',
    status: 'Completed',
    description:
      'Containerized multi-tier web applications with Docker & Compose, built GitHub Actions pipelines deploying to Azure VM and Azure Static Web Apps, and built PrepAI with Flutter Riverpod & audio I/O.',
    tags: ['Docker', 'GitHub Actions', 'Azure', 'Flutter'],
  },
  {
    id: 'journey-3',
    title: 'Production Spring Boot Testing, Observability & Terraform Modules',
    timeframe: 'In Progress · 2026',
    status: 'In Progress',
    description:
      'Deepening integration testing with JUnit 5 & Testcontainers, publishing clean Terraform module repositories to GitHub, and advancing LeetCode contest performance toward 1,800+ rating.',
    tags: ['Terraform', 'JUnit 5', 'Testcontainers', 'DSA'],
  },
  {
    id: 'journey-4',
    title: 'Kubernetes Orchestration & Distributed Backend Internships',
    timeframe: 'Planned · 2026–2027',
    status: 'Planned',
    description:
      'Preparing for Software Development Engineer and Cloud/DevOps Internships while expanding hands-on experience with AKS/Kubernetes deployments, Redis caching, and distributed system design.',
    tags: ['Kubernetes', 'Redis', 'System Design', 'SDE Intern'],
  },
];
