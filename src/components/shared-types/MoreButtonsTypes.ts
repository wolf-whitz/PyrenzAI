import {
  WhatshotOutlined as Sparkles,
  RefreshOutlined as RefreshCw,
  LocalFireDepartmentOutlined as Flame,
  SellOutlined as Tag,
} from '@mui/icons-material';

export type ButtonType = {
  icon: React.ElementType;
  label: string;
  type: string;
  max_character: number;
  page: number;
  tag?: string;
  gender?: 'male' | 'female';
};

export type CustomButtonProps = {
  onButtonClick: (
    type: string,
    max_character: number,
    page: number,
    tag?: string,
    gender?: 'male' | 'female'
  ) => void;
};

export type ModalResultType = {
  name: string;
};

export type MoreButtonsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onButtonClick: (
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
    type: 'latest',
    max_character: 10,
    page: 1,
  },
  {
    icon: RefreshCw,
    label: 'HomePageMoreButtons.btn.random',
    type: 'random',
    max_character: 10,
    page: 1,
  },
  {
    icon: Flame,
    label: 'HomePageMoreButtons.btn.hot',
    type: 'hot',
    max_character: 10,
    page: 1,
  },
  {
    icon: Tag,
    label: 'HomePageMoreButtons.btn.male',
    gender: 'male',
    type: 'tags',
    max_character: 10,
    page: 1,
    tag: 'male',
  },
];
