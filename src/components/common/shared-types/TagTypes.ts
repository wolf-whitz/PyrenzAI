export interface Tag {
  id: string;
  name: string;
}

export interface TextareaFormProps {
  formState: {
    persona: string;
    name: string;
    model_instructions: string;
    scenario: string;
    description: string;
    first_message: string;
    tags: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
