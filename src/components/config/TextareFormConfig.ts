export interface TextareaField {
  name: string;
  label: string;
  placeholder: string;
  is_tag?: boolean;
  maxLength?: number;
  showTokenizer?: boolean;
  is_alternatives?: boolean;
  max_alternatives?: number;
  is_permanent?: boolean;
  is_temporary?: boolean;
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
        is_permanent: false,
      },
      {
        name: 'name',
        label: 'Name',
        placeholder: 'Enter character name e.g., John Doe',
        maxLength: 50,
        showTokenizer: true,
        is_permanent: false,
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
        is_permanent: true,
      },
      {
        name: 'scenario',
        label: 'Scenario',
        placeholder: 'Describe a scenario...',
        showTokenizer: true,
        is_permanent: false,
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
          "Provide instructions for the model... (Never use 'you' or 'your', always use {{char}} or {{user}})",
        showTokenizer: true,
        is_permanent: true,
      },
      {
        name: 'message_example',
        label: 'Message Example',
        placeholder: `Provide examples for the model to follow. Never use "you" or "your"; always use {{char}}. Do not mention {{user}}. This is intended to instruct the model through examples.`,
        showTokenizer: true,
        is_permanent: true,
      },
      {
        name: 'first_message',
        label: 'First Message',
        placeholder: 'What is the first message...',
        showTokenizer: true,
        is_alternatives: true,
        max_alternatives: 15,
        is_permanent: false,
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
        is_permanent: true,
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
        is_permanent: true,
      },
    ],
  },
];
