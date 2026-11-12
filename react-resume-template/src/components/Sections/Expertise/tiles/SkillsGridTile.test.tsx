import {render, screen, within} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import SkillsGridTile from './SkillsGridTile';

describe('SkillsGridTile', () => {
  it('presents full-stack engineering as the core and separates supporting and exploratory skills', () => {
    render(<SkillsGridTile />);

    expect(screen.getByRole('heading', {name: 'Built around full-stack engineering.'})).toBeTruthy();

    const core = screen.getByRole('region', {name: 'Full Stack Development'});
    for (const skill of ['TypeScript', 'React', 'Java', 'Spring Boot', 'Node.js']) {
      expect(within(core).getByText(skill)).toBeTruthy();
    }

    const supporting = screen.getByRole('region', {name: 'Infrastructure & Quality'});
    for (const skill of [
      'AWS',
      'GitHub Actions',
      'CI/CD',
      'OIDC / IAM',
      'Playwright',
      'Vitest',
      'Jest',
      'Vite',
      'Tailwind CSS',
    ]) {
      expect(within(supporting).getByText(skill)).toBeTruthy();
    }

    const exploration = screen.getByRole('region', {name: 'Exploration & Additional Interests'});
    for (const skill of [
      'Python',
      'LLM APIs',
      'LangChain',
      'GitHub Copilot',
      'Claude Code',
      'Unreal Engine',
      'Unity',
      'Adobe Premiere',
    ]) {
      expect(within(exploration).getByText(skill)).toBeTruthy();
    }
  });
});
