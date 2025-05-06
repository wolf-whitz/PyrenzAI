import { Whatshot as Sparkles, Refresh as RefreshCw, LocalFireDepartment as Flame, Sell as Tag } from '@mui/icons-material';

export type ButtonType = {
  icon: React.ElementType;
  label: string;
  Function: string;
  type: string;
  max_character: number;
  page: number;
  tag?: string;
};

export type ModalResultType = {
  name: string;
};

export type MoreButtonsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onButtonClick: (
    Function: string,
    type: string,
    max_character: number,
    page: number,
    tag?: string
  ) => void;
  buttons: ButtonType[];
};

export const buttons: ButtonType[] = [
  {
    icon: Sparkles,
    label: 'HomePageMoreButtons.btn.latest',
    Function: 'GetLatestCharacters',
    type: 'GetLatestCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: RefreshCw,
    label: 'HomePageMoreButtons.btn.random',
    Function: 'GetRandomCharacters',
    type: 'GetRandomCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: Flame,
    label: 'HomePageMoreButtons.btn.hot',
    Function: 'GetHotCharacters',
    type: 'GetHotCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: Tag,
    label: 'HomePageMoreButtons.btn.male',
    Function: 'GetCharactersWithTags',
    type: 'GetTaggedCharacters',
    max_character: 10,
    page: 1,
    tag: 'male',
  },
];

export type CustomButtonProps = {
  onButtonClick: (
    Function: string,
    type: string,
    max_character: number,
    page: number,
    tag?: string
  ) => void;
};
