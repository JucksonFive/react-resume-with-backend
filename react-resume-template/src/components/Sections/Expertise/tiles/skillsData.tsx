import {FC} from 'react';
import {FaJava, FaNodeJs, FaReact} from 'react-icons/fa6';
import {SiSpringboot, SiTypescript} from 'react-icons/si';

type SkillIcon = FC<{className?: string; 'aria-hidden'?: boolean}>;

export interface CoreSkill {
  name: string;
  Icon: SkillIcon;
}

export interface SkillGroup {
  title: string;
  skills: readonly string[];
}

export const CORE_SKILLS: readonly CoreSkill[] = [
  {name: 'TypeScript', Icon: SiTypescript},
  {name: 'React', Icon: FaReact},
  {name: 'Java', Icon: FaJava},
  {name: 'Spring Boot', Icon: SiSpringboot},
  {name: 'Node.js', Icon: FaNodeJs},
];

export const SUPPORTING_SKILLS: readonly SkillGroup[] = [
  {title: 'Cloud & delivery', skills: ['AWS', 'GitHub Actions', 'CI/CD', 'OIDC / IAM']},
  {title: 'Testing & frontend tools', skills: ['Playwright', 'Vitest', 'Jest', 'Vite', 'Tailwind CSS']},
];

export const EXPLORATION_SKILLS: readonly SkillGroup[] = [
  {title: 'AI engineering', skills: ['Python', 'LLM APIs', 'LangChain', 'GitHub Copilot', 'Claude Code']},
  {title: 'Creative tools', skills: ['Unreal Engine', 'Unity', 'Adobe Premiere']},
];
