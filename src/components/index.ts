/**
 * @fileoverview This file is the main entry point for all components in the project.
 * It exports all components, making them available for import in other parts of the application.
 * @example
 * import { Button } from '~/components';
 * <Button label="Click Me" onClick={handleClick} />
 * @see https://reactjs.org/docs/code-splitting.html
 * @see https://reactjs.org/docs/optimizing-performance.html#code-splitting
 */


import Banner from '@layout/Banner/Banner';
import Footer from '@layout/Footer/Footer';
import PreviewFooter from '@layout/Footer/PreviewFooter';
import SearchBar from '@layout/SearchBar/SearchBar';
import PreviewHeader from '@layout/Header/PreviewHeader';
import HeroSection from '@layout/Sections/Hero/PreviewHeroSection';
import FeaturesSection from '@layout/Sections/FeaturesSection';
import UserProfileHeader from '@layout/Header/UserProfileHeader';


import Sidebar from '@layout/Sidebar/sidebar';
import MobileSidebar from '@layout/Sidebar/sidebar';
import SettingsSidebar from '@layout/Sidebar/SettingsSidebar';
import CommunityGuidelines from '@layout/Sidebar/GuidelineSidebar';


import {
  Spinner,
  ChatPageSpinner,
  SettingsPageLoader,
} from '@ui/Spinner/Spinner';


import { WindowAlert } from '@ui/Alert/Alert';


import GenerateButton from '@ui/Buttons/GenerateBtn';
import CreateButton from '@ui/Buttons/CreateBtn';


import CheckboxField from '@ui/Input/CheckBox';
import InputField from '@ui/Input/InputField';
import RequiredFieldsPopup from '@ui/Fields/RequiredFieldsPopup';
import CustomModelFields from '@ui/Fields/CustomFields';


import DropdownField from '@ui/Dropdown/DropdownField';
import AISelectDropdown from '@ui/Dropdown/AISelectDropdown';
import GenderDropdown from '@ui/Dropdown/GenderDropdown';
import LanguageDropdown from '@ui/Dropdown/LanguageDropdown';


import ModelSelection from '@ui/Selectors/ModelSelection';


import Textarea from '@ui/Textarea/Textarea';


import ImageUploader from '@ui/ImageUploader/ImageUploader';


import PersonaList from '@ui/Lists/PersonaList';
import CharacterList from '@ui/Lists/CharacterList';


import Dropzone from '@ui/Dropzone/Dropzone';


import ChatContainer from '@ui/Chats/Container/ChatContainer';
import PreviousChat from '@ui/Chats/menu/PreviousMessageContainer';
import Menu from '@ui/Chats/menu/Menu';
import ChatMain from '@ui/Chats/main/Chatmain';


import CharacterForm from '@ui/Form/CharacterForm';
import FormActions from '@ui/Actions/FormActions';
import TokenSummary from '@ui/Summary/TokenSummary';
import VisibilityCheckboxes from '@ui/CheckBox/VisibilityCheckboxes';
import ImageUpload from '@ui/ImageUploader/ImageUpload';


import CharacterCard from '@ui/Cards/CharacterCard';
import LoadMore from '@ui/LoadMore/LoadMoreButton';
import SkeletonCard from '@ui/Skeleton/SkeletonCard';
import CustomButton from '@ui/Buttons/Buttons';
import FeatureCard from '@ui/Cards/FeaturesCard';
import PersonaCard from '@ui/Cards/PersonaCard';


import CharacterCardModal from '@ui/Modal/CharacterCardModal';
import AuthenticationModal from '~/components/common/ui/Modal/Auth/AuthenticationModal';
import DownloadModal from '@ui/Modal/DownloadsModal';
import LanguageModal from '@ui/Modal/LanguageModal';
import DraftsModal from '@ui/Modal/DraftsModal';
import MoreButtonsModal from '@ui/Modal/MoreButtonsModal';
import CreatePersonaModal from '@ui/Modal/CreatePersonaModal';
import CharacterCardImageModal from '@ui/Modal/CharacterCardImageModal';
import CreateCharacterCardImageModal from '@ui/Modal/CreateCharacterCardImageModal';
import ProviderModals from '@ui/Modal/ProvidersModal';
import AdModal from '@ui/Modal/AdModal';


import CustomContextMenu from '@ui/ContextMenu/CustomContextMenu';

import SliderComponent from '@ui/Slider/SliderComponent';


import { Card, CardContent, CardTitle, CardHeader } from '@ui/ShadCdn/card';


import Persona from '@ui/Persona/Persona';


import ImportCharacterModal from '@ui/Import/ImportCharacterModal';


import useFetchUserUUID from '@hooks/useFetchUserUUID';
import useSyncSearchParams from '@hooks/useSyncSearchParams';
import useFetchCharacters from '@hooks/useFetchCharacters';


import Pagination from '@ui/Pagination/Pagination';

export {

  Banner,
  Footer,
  SearchBar,
  PreviewHeader,
  PreviewFooter,
  HeroSection,
  FeaturesSection,
  UserProfileHeader,


  ImportCharacterModal,


  useFetchCharacters,
  useSyncSearchParams,
  useFetchUserUUID,


  Pagination,


  CharacterForm,
  FormActions,
  TokenSummary,
  VisibilityCheckboxes,
  ImageUpload,


  AISelectDropdown,
  GenderDropdown,
  DropdownField,
  LanguageDropdown,


  WindowAlert,


  ChatPageSpinner,
  Spinner,
  SettingsPageLoader,


  ChatContainer,
  PreviousChat,
  Menu,
  ChatMain,


  SliderComponent,


  CharacterCard,
  LoadMore,
  SkeletonCard,
  CustomButton,
  FeatureCard,
  PersonaCard,


  CheckboxField,
  CustomModelFields,
  RequiredFieldsPopup,


  ModelSelection,


  InputField,


  GenerateButton,
  CreateButton,


  Dropzone,


  PersonaList,
  CharacterList,


  Sidebar,
  MobileSidebar,
  SettingsSidebar,
  CommunityGuidelines,


  Textarea,


  CharacterCardModal,
  AuthenticationModal,
  DownloadModal,
  ProviderModals,
  LanguageModal,
  DraftsModal,
  MoreButtonsModal,
  CreatePersonaModal,
  CharacterCardImageModal,
  CreateCharacterCardImageModal,
  AdModal,


  CustomContextMenu,

  Card,
  CardContent,
  CardTitle,
  CardHeader,


  ImageUploader,


  Persona,
};


