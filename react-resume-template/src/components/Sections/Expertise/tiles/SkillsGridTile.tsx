import {FC} from 'react';

import {CORE_SKILLS, EXPLORATION_SKILLS, Skill, SkillGroup, SUPPORTING_SKILLS} from './skillsData';

const SkillCard: FC<{skill: Skill; emphasis?: 'primary' | 'secondary' | 'quiet'}> = ({
  skill,
  emphasis = 'secondary',
}) => {
  const {name, Icon, color} = skill;
  const iconSize = emphasis === 'primary' ? 'h-7 w-7' : 'h-[22px] w-[22px]';
  const cardSize =
    emphasis === 'primary'
      ? 'min-h-24 flex-col justify-center gap-3 px-3 py-4 text-center text-base font-semibold'
      : emphasis === 'quiet'
        ? 'min-h-14 gap-2.5 px-3 py-2.5 text-sm text-muted-foreground'
        : 'min-h-16 gap-3 px-3.5 py-3 text-sm font-medium';

  return (
    <li
      className={`group flex items-center rounded-xl border border-border/80 bg-card/80 shadow-sm transition-colors duration-150 hover:border-primary/30 hover:bg-card hover:shadow-md ${cardSize}`}>
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg bg-muted/70 ${emphasis === 'primary' ? 'h-11 w-11' : 'h-9 w-9'}`}>
        <Icon aria-hidden className={`${iconSize} ${color}`} />
      </span>
      <span className="leading-snug text-foreground">{name}</span>
    </li>
  );
};

const SkillGroupGrid: FC<{groups: readonly SkillGroup[]; emphasis?: 'secondary' | 'quiet'}> = ({
  groups,
  emphasis = 'secondary',
}) => (
  <div className="space-y-6">
    {groups.map(group => (
      <div key={group.title}>
        <h5 className="mb-3 text-sm font-medium text-muted-foreground">{group.title}</h5>
        <ul
          aria-label={group.title}
          className={`grid gap-2.5 ${emphasis === 'quiet' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
          {group.skills.map(skill => (
            <SkillCard key={skill.name} skill={skill} emphasis={emphasis} />
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const SkillsGridTile: FC = () => (
  <div className="w-full py-2 sm:py-4">
    <div className="max-w-3xl">
      <p className="text-sm font-medium text-primary">Tech Stack</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Built around full-stack engineering.
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        My core expertise is building and maintaining production applications across frontend, backend, and cloud
        infrastructure. Beyond that, I explore AI-powered development tools and interactive technologies.
      </p>
    </div>

    <section aria-labelledby="core-skills-title" className="mt-8 border-t border-border/70 pt-6">
      <h4 id="core-skills-title" className="text-lg font-semibold tracking-tight text-foreground">
        Full Stack Development
      </h4>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CORE_SKILLS.map(skill => (
          <SkillCard key={skill.name} skill={skill} emphasis="primary" />
        ))}
      </ul>
    </section>

    <section aria-labelledby="supporting-skills-title" className="mt-8 border-t border-border/70 pt-6">
      <h4 id="supporting-skills-title" className="text-lg font-semibold tracking-tight text-foreground">
        Infrastructure &amp; Quality
      </h4>
      <div className="mt-5">
        <SkillGroupGrid groups={SUPPORTING_SKILLS} />
      </div>
    </section>

    <section aria-labelledby="exploration-skills-title" className="mt-8 border-t border-border/70 pt-6">
      <h4 id="exploration-skills-title" className="text-lg font-semibold tracking-tight text-foreground">
        AI &amp; Exploration
      </h4>
      <div className="mt-5">
        <SkillGroupGrid groups={EXPLORATION_SKILLS.slice(0, 1)} />
      </div>
      <div className="mt-6 rounded-xl bg-muted/35 px-4 py-4 sm:px-5">
        <SkillGroupGrid groups={EXPLORATION_SKILLS.slice(1)} emphasis="quiet" />
      </div>
    </section>
  </div>
);

SkillsGridTile.displayName = 'SkillsGridTile';

export default SkillsGridTile;
