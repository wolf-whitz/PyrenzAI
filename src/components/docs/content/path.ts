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
    {
      slug: 'what-is-a-format',
      file: 'formats.md',
      title: 'What is a Format?',
      description:
        'Token Efficiency: They use fewer tokens compared to NL, which can help optimize performance and reduce costs. Enhanced Influence: Formats provide a stronger influence on the AI’s responses, guiding it more reliably than unstructured text.',
      layout: 'default',
    },
    {
      slug: 'what-is-a-jailbreak',
      file: 'jailbreak.md',
      title: 'What is a Jailbreak?',
      description:
        `In the AI world, **“jailbreaking”** means finding a clever way to *bypass restrictions* built into language models like this one. Think of it like trying to trick the AI into doing something it's normally not allowed to do — whether that's by rephrasing a request, changing context, or injecting sneaky commands. It’s not hacking the system directly, but more like **social engineering for AI** — wordplay that gets around the rules.`,
      layout: 'default',
    },
  ],
} satisfies { default: string; pages: DocMeta[] };
