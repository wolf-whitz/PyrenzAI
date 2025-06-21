import type { DocMeta } from '@shared-types';

export const docPath = {
  default: 'intro',
  pages: [
    {
      slug: 'intro',
      file: 'Intro.md',
      title: 'PyrenzAI',
      description:
        'PyrenzAI is your go-to AI chat app where you can vibe with endless anime characters 24/7. Dive into fully immersive stories',
      layout: 'default',
      banner: '/Banner.png',
    },
    {
      slug: 'create-a-character',
      file: 'CreateCharacter.md',
      title: 'Create A Character',
      description:
        'What is a Character? In PyrenzAI, a Character denotes a fictional entity that can be customized as either a personal or public persona. This guide will assist you in the character creation process.',
      layout: 'default',
    },
  ],
} satisfies { default: string; pages: DocMeta[] };
