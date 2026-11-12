export type ProjectStatus = 'Exploring' | 'In progress' | 'Documenting';

export type Project = {
  slug: string;
  number: string;
  category: string;
  name: string;
  description: string;
  technologies: string[];
  status: ProjectStatus;
  href?: string;
};

// Starter directions only. Replace with real project information and links when ready.
export const projects: Project[] = [
  {
    slug: 'network-field-notes', number: '01', category: 'NETWORKING / FIELD NOTES',
    name: 'Mapping the invisible.',
    description: 'A place to document network experiments, topologies, and the protocols that connect systems.',
    technologies: ['NETWORKING', 'DOCUMENTATION'], status: 'Exploring',
  },
  {
    slug: 'security-research', number: '02', category: 'CYBERSECURITY / RESEARCH',
    name: 'Think like the threat.',
    description: 'A future home for responsible security labs, notes, and lessons learned from hands-on exploration.',
    technologies: ['SECURITY', 'RESEARCH'], status: 'Exploring',
  },
  {
    slug: 'engineering-systems', number: '03', category: 'ENGINEERING / SYSTEMS',
    name: 'Make complexity useful.',
    description: 'Experiments in building small tools and thoughtful systems; details will be added as work is documented.',
    technologies: ['ENGINEERING', 'SYSTEMS'], status: 'Exploring',
  },
];
