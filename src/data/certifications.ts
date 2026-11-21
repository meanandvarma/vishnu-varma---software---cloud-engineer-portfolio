import { CertificationItem } from '../types/portfolio';

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    id: 'az-900',
    name: 'Microsoft Certified: Azure Fundamentals',
    code: 'AZ-900',
    issuer: 'Microsoft',
    date: 'July 13, 2024',
    evidenceStatus: 'Resume-Stated',
    credentialNote: 'Listed on both SDE and Cloud resumes with completion date July 13, 2024. Public Microsoft Learn transcript URL pending.',
  },
  {
    id: 'ai-900',
    name: 'Microsoft Certified: Azure AI Fundamentals',
    code: 'AI-900',
    issuer: 'Microsoft',
    date: 'June 23, 2024',
    evidenceStatus: 'Resume-Stated',
    credentialNote: 'Listed on both SDE and Cloud resumes with completion date June 23, 2024. Public credential URL pending.',
  },
  {
    id: 'nptel-cn',
    name: 'Computer Networks and Internet Protocols',
    code: 'NPTEL',
    issuer: 'NPTEL (IIT)',
    date: 'May 2025',
    evidenceStatus: 'Resume-Stated',
    credentialNote: 'Listed on both SDE and Cloud resumes (May 2025). Covers TCP/IP, routing, transport protocols, and network security.',
  },
  {
    id: 'dp-900',
    name: 'Microsoft Certified: Azure Data Fundamentals',
    code: 'DP-900',
    issuer: 'Microsoft',
    evidenceStatus: 'Resume-Stated',
    credentialNote: 'Listed on Cloud Engineering resume; completion date and credential ID not specified in supplied PDF.',
  },
  {
    id: 'sc-900',
    name: 'Microsoft Certified: Security, Compliance, and Identity Fundamentals',
    code: 'SC-900',
    issuer: 'Microsoft',
    evidenceStatus: 'Resume-Stated',
    credentialNote: 'Listed on Cloud Engineering resume; completion date and credential ID not specified in supplied PDF.',
  },
];
