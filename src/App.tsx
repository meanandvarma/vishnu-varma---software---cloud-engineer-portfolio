/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#FAFBFD] text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 transition-colors">
        <Navbar />
        <div className="flex-1">
          <ErrorBoundary fallbackTitle="Portfolio page encountered an error">
            <Routes>
              <Route
                path="/"
                element={<HomePage theme={theme} onToggleTheme={toggleTheme} />}
              />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/playground/:tab" element={<PlaygroundPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
        <Footer theme={theme} onToggleTheme={toggleTheme} />
      </div>
    </BrowserRouter>
  );
}
