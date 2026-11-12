import {FC} from 'react';

import {CORE_SKILLS, EXPLORATION_SKILLS, SUPPORTING_SKILLS, SkillGroup} from './skillsData';

const SkillChips: FC<{skills: readonly string[]}> = ({skills}) => (
  <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
    {skills.map(skill => (
      <li key={skill} className="rounded-md bg-muted/70 px-2.5 py-1 text-sm text-muted-foreground">
        {skill}
      </li>
    ))}
  </ul>
);

const SkillGroupList: FC<{groups: readonly SkillGroup[]}> = ({groups}) => (
  <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
    {groups.map(group => (
      <div key={group.title}>
        <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{group.title}</h4>
        <SkillChips skills={group.skills} />
      </div>
    ))}
  </div>
);

const SkillsGridTile: FC = () => (
  <div className="w-full py-2 sm:py-4">
    <div className="max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Stack</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Built around full-stack engineering.
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        My core expertise is building and maintaining production applications across frontend, backend, and cloud
        infrastructure. Beyond that, I explore AI-powered development tools and interactive technologies.
      </p>
    </div>

    <div className="mt-8 grid gap-8 border-t border-border/70 pt-7 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      <section aria-labelledby="core-skills-title">
        <h4 id="core-skills-title" className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
          Full Stack Development
        </h4>
        <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {CORE_SKILLS.map(({name, Icon}) => (
            <li key={name} className="flex items-center gap-3 py-1 text-lg font-medium tracking-tight text-foreground">
              <Icon aria-hidden className="h-4 w-4 shrink-0 text-primary/75" />
              {name}
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-7">
        <section aria-labelledby="supporting-skills-title">
          <h4
            id="supporting-skills-title"
            className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Infrastructure &amp; Quality
          </h4>
          <div className="mt-4">
            <SkillGroupList groups={SUPPORTING_SKILLS} />
          </div>
        </section>

        <section aria-labelledby="exploration-skills-title" className="border-t border-border/70 pt-6">
          <h4
            id="exploration-skills-title"
            className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Exploration &amp; Additional Interests
          </h4>
          <div className="mt-4">
            <SkillGroupList groups={EXPLORATION_SKILLS} />
          </div>
        </section>
      </div>
    </div>
  </div>
);

SkillsGridTile.displayName = 'SkillsGridTile';

export default SkillsGridTile;
