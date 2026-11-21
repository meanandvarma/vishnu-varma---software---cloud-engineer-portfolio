import { useEffect, useState } from 'react';
import { HeroSection } from '../sections/HeroSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { AboutSection } from '../sections/AboutSection';
import { SkillsSection } from '../sections/SkillsSection';
import { CodeConsistencySection } from '../sections/CodeConsistencySection';
import { CredentialsSection } from '../sections/CredentialsSection';
import { ContactSection } from '../sections/ContactSection';
import { ThemeMode } from '../hooks/useTheme';
import { fetchGitHubStats, fetchLeetCodeStats } from '../services/portfolioApi';
import { GitHubStatsResponse, LeetCodeStatsResponse } from '../types/portfolio';

interface HomePageProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function HomePage({ theme, onToggleTheme }: HomePageProps) {
  const [github, setGithub] = useState<GitHubStatsResponse | null>(null);
  const [leetcode, setLeetcode] = useState<LeetCodeStatsResponse | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoadingMetrics(true);
    setMetricsError(null);
    try {
      const [gh, lc] = await Promise.all([fetchGitHubStats(), fetchLeetCodeStats()]);
      setGithub(gh);
      setLeetcode(lc);
    } catch (err) {
      setMetricsError(err instanceof Error ? err.message : 'Unable to refresh GitHub & LeetCode data');
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <main>
      <HeroSection theme={theme} onToggleTheme={onToggleTheme} />
      <ProjectsSection />
      <AboutSection />
      <SkillsSection />
      <CodeConsistencySection
        leetcode={leetcode}
        github={github}
        loading={loadingMetrics}
        error={metricsError}
        onRefresh={loadMetrics}
      />
      <CredentialsSection />
      <ContactSection />
    </main>
  );
}
