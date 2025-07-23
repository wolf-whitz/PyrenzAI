export interface TextareaField {
  name: string;
  label: string;
  placeholder: string;
  is_tag?: boolean;
  maxLength?: number;
  showTokenizer?: boolean;
}

export interface TextareaCategory {
  category: string;
  fields: TextareaField[];
}

export const textareasByCategory: TextareaCategory[] = [
  {
    category: 'Basic Information',
    fields: [
      {
        name: 'title',
        label: 'Title',
        placeholder: 'Enter character title e.g., The Brave Warrior',
        maxLength: 100,
        showTokenizer: true,
      },
      {
        name: 'name',
        label: 'Name',
        placeholder: 'Enter character name e.g., John Doe',
        maxLength: 50,
        showTokenizer: true,
      },
    ],
  },
  {
    category: 'Character Details',
    fields: [
      {
        name: 'description',
        label: 'Description',
        placeholder: 'Describe the character...',
        showTokenizer: false,
      },
      {
        name: 'persona',
        label: 'Persona',
        placeholder: "Define the character's persona...",
        showTokenizer: true,
      },
      {
        name: 'scenario',
        label: 'Scenario',
        placeholder: 'Describe a scenario...',
        showTokenizer: true,
      },
    ],
  },
  {
    category: 'Interaction Settings',
    fields: [
      {
        name: 'model_instructions',
        label: 'Model Instructions',
        placeholder:
          "Provide instructions for the model... (Never use 'you' or 'your' always use {{char}})",
        showTokenizer: true,
      },
      {
        name: 'first_message',
        label: 'First Message',
        placeholder: 'What is the first message...',
        showTokenizer: true,
      },
    ],
  },
  {
    category: 'Additional Information',
    fields: [
      {
        name: 'lorebook',
        label: 'Lorebook',
        placeholder: 'Enter lorebook details...',
        showTokenizer: true,
      },
      {
        name: 'tags',
        label: 'Tags',
        placeholder: 'Add tags separated by commas...',
        is_tag: true,
        maxLength: 150,
        showTokenizer: false,
      },
    ],
  },
  {
    category: 'Attribute',
    fields: [
      {
        name: 'attribute',
        label: 'Attribute',
        placeholder: 'Strength, Agility, Intelligence...',
        showTokenizer: true,
      },
    ],
  },
];
