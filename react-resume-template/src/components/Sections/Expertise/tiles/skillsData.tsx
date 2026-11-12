import {FC} from 'react';
import {BsAnthropic, BsOpenai} from 'react-icons/bs';
import {FaAws, FaFilm, FaJava, FaNodeJs, FaReact} from 'react-icons/fa6';
import {GoCopilot} from 'react-icons/go';
import {
  SiGithubactions,
  SiJest,
  SiLangchain,
  SiPython,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
  SiUnity,
  SiUnrealengine,
  SiVite,
  SiVitest,
} from 'react-icons/si';
import {TbShieldLock} from 'react-icons/tb';
import {VscBeaker, VscGitPullRequest} from 'react-icons/vsc';

type SkillIcon = FC<{className?: string; 'aria-hidden'?: boolean}>;

export interface Skill {
  name: string;
  Icon: SkillIcon;
  color: string;
}

export interface SkillGroup {
  title: string;
  skills: readonly Skill[];
}

export const CORE_SKILLS: readonly Skill[] = [
  {name: 'TypeScript', Icon: SiTypescript, color: 'text-[#3178C6]'},
  {name: 'React', Icon: FaReact, color: 'text-[#61DAFB]'},
  {name: 'Java', Icon: FaJava, color: 'text-[#E76F00]'},
  {name: 'Spring Boot', Icon: SiSpringboot, color: 'text-[#6DB33F]'},
  {name: 'Node.js', Icon: FaNodeJs, color: 'text-[#339933]'},
];

export const SUPPORTING_SKILLS: readonly SkillGroup[] = [
  {
    title: 'Infrastructure & delivery',
    skills: [
      {name: 'AWS', Icon: FaAws, color: 'text-[#FF9900]'},
      {name: 'GitHub Actions', Icon: SiGithubactions, color: 'text-[#2088FF]'},
      {name: 'CI/CD', Icon: VscGitPullRequest, color: 'text-primary'},
      {name: 'OIDC / IAM', Icon: TbShieldLock, color: 'text-[#FF9900]'},
    ],
  },
  {
    title: 'Testing & frontend tools',
    skills: [
      {name: 'Playwright', Icon: VscBeaker, color: 'text-[#2EAD33]'},
      {name: 'Vitest', Icon: SiVitest, color: 'text-[#6E9F18]'},
      {name: 'Jest', Icon: SiJest, color: 'text-[#C21325]'},
      {name: 'Vite', Icon: SiVite, color: 'text-[#646CFF]'},
      {name: 'Tailwind CSS', Icon: SiTailwindcss, color: 'text-[#06B6D4]'},
    ],
  },
];

export const EXPLORATION_SKILLS: readonly SkillGroup[] = [
  {
    title: 'AI engineering',
    skills: [
      {name: 'Python', Icon: SiPython, color: 'text-[#3776AB]'},
      {name: 'LLM APIs', Icon: BsOpenai, color: 'text-[#10A37F]'},
      {name: 'LangChain', Icon: SiLangchain, color: 'text-[#1C3C3C]'},
      {name: 'GitHub Copilot', Icon: GoCopilot, color: 'text-foreground'},
      {name: 'Claude Code', Icon: BsAnthropic, color: 'text-[#D97757]'},
    ],
  },
  {
    title: 'Creative tools',
    skills: [
      {name: 'Unreal Engine', Icon: SiUnrealengine, color: 'text-foreground'},
      {name: 'Unity', Icon: SiUnity, color: 'text-foreground'},
      {name: 'Adobe Premiere', Icon: FaFilm, color: 'text-[#9999FF]'},
    ],
  },
];
