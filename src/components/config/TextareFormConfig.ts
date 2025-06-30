export interface TextareaField {
  name: string;
  label: string;
  placeholder: string;
  is_tag?: boolean;
  maxLength?: number;
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
        name: 'name',
        label: 'Name',
        placeholder: 'Enter character name e.g., John Doe',
        maxLength: 50,
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
      },
      {
        name: 'persona',
        label: 'Persona',
        placeholder: 'Define the character\'s persona...',
      },
      {
        name: 'scenario',
        label: 'Scenario',
        placeholder: 'Describe a scenario...',
      },
    ],
  },
  {
    category: 'Interaction Settings',
    fields: [
      {
        name: 'model_instructions',
        label: 'Model Instructions',
        placeholder: 'Provide instructions for the model...',
      },
      {
        name: 'first_message',
        label: 'First Message',
        placeholder: 'What is the first message...',
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
      },
      {
        name: 'tags',
        label: 'Tags',
        placeholder: 'Add tags separated by commas...',
        is_tag: true,
        maxLength: 150,
      },
    ],
  },
];
