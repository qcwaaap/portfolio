/** Навыки для секции Skills. `tone` — цвет маркерной подсветки заголовка группы. */
export type SkillGroup = { id: string; title: string; tone: string; items: string[] };

export const SKILLS: readonly SkillGroup[] = [
  { id: 'frontend', title: 'FRONTEND', tone: '#8db8f7', items: ['React', 'Next.js', 'TypeScript', 'HTML / CSS', 'Three.js'] },
  { id: 'backend', title: 'BACKEND', tone: '#f7a6cb', items: ['Python', 'FastAPI', 'Go', 'Node.js', 'PHP', 'SQL'] },
  { id: 'tools', title: 'TOOLS', tone: '#cdf24f', items: ['Git', 'GitHub', 'Docker', 'VS Code', 'Figma'] },
];
