/**
 * @fileoverview This file is the main entry point for all components in the project.
 * It exports all components, making them available for import in other parts of the application.
 * @example
 * import { Button } from '~/components';
 * <Button label="Click Me" onClick={handleClick} />
 * @see https://reactjs.org/docs/code-splitting.html
 * @see https://reactjs.org/docs/optimizing-performance.html#code-splitting
 */

// Layout Components
import Banner from '@layout/Banner/Banner';
import Footer from '@layout/Footer/Footer';
import PreviewFooter from '@layout/Footer/PreviewFooter';
import SearchBar from '@layout/SearchBar/SearchBar';
import PreviewHeader from '@layout/Header/PreviewHeader';
import HeroSection from '@layout/Sections/Hero/PreviewHeroSection';
import FeaturesSection from '@layout/Sections/FeaturesSection';

// Sidebar Components
import Sidebar from '@layout/Sidebar/sidebar';
import MobileSidebar from '@layout/Sidebar/sidebar';
import SettingsSidebar from '@layout/Sidebar/SettingsSidebar';
import CommunityGuidelines from '@layout/Sidebar/GuidelineSidebar';

//Spinner
import {
  Spinner,
  ChatPageSpinner,
  SettingsPageLoader,
} from '@ui/Spinner/Spinner';

// Alert
import { WindowAlert } from '@ui/Alert/Alert';

// Buttons
import GenerateButton from '@ui/Buttons/GenerateBtn';
import CreateButton from '@ui/Buttons/CreateBtn';

// Fields
import CheckboxField from '@ui/Input/CheckBox';
import InputField from '@ui/Input/InputField';
import RequiredFieldsPopup from '@ui/Fields/RequiredFieldsPopup';
import CustomModelFields from '@ui/Fields/CustomFields';

//Dropdowns
import DropdownField from '@ui/Dropdown/DropdownField';
import AISelectDropdown from '@ui/Dropdown/AISelectDropdown';
import GenderDropdown from '@ui/Dropdown/GenderDropdown';
import LanguageDropdown from '@ui/Dropdown/LanguageDropdown';

//Selectors
import ModelSelection from '@ui/Selectors/ModelSelection';

// Textrea
import Textarea from '@ui/Textarea/Textarea';

// Image Uploader
import ImageUploader from '@ui/ImageUploader/ImageUploader';

//List
import PersonaList from '@ui/Lists/PersonaList';
import CharacterList from '@ui/Lists/CharacterList';

// Dropzone
import Dropzone from '@ui/Dropzone/Dropzone';

// Chat Components
import ChatContainer from '@ui/Chats/Container/ChatContainer';
import PreviousChat from '@ui/Chats/menu/PreviousMessageContainer';
import Menu from '@ui/Chats/menu/Menu';
import ChatMain from '@ui/Chats/main/Chatmain';

// Create Component
import CharacterForm from '@ui/Form/CharacterForm';
import FormActions from '@ui/Actions/FormActions';
import TokenSummary from '@ui/Summary/TokenSummary';
import VisibilityCheckboxes from '@ui/CheckBox/VisibilityCheckboxes';
import ImageUpload from '@ui/ImageUploader/ImageUpload';

// UI/UX Components
import CharacterCard from '@ui/Cards/CharacterCard';
import LoadMore from '@ui/LoadMore/LoadMoreButton';
import SkeletonCard from '@ui/Skeleton/SkeletonCard';
import CustomButton from '@ui/Buttons/Buttons';
import FeatureCard from '@ui/Cards/FeaturesCard';
import PersonaCard from '@ui/Cards/PersonaCard';

// Modal Components
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

// Slider
import SliderComponent from '@ui/Slider/SliderComponent';

// Card Components
import { Card, CardContent, CardTitle, CardHeader } from '@ui/ShadCdn/card';

// Persona Components
import Persona from '@ui/Persona/Persona';

//Import
import ImportCharacterModal from '@ui/Import/ImportCharacterModal';

//Hooks
import useFetchUserUUID from '@hooks/useFetchUserUUID';
import useSyncSearchParams from '@hooks/useSyncSearchParams';
import useFetchCharacters from '@hooks/useFetchCharacters';


//Pagination
import Pagination from '@ui/Pagination/Pagination';


export {
  // Layout
  Banner,
  Footer,
  SearchBar,
  PreviewHeader,
  PreviewFooter,
  HeroSection,
  FeaturesSection,

  //Import
  ImportCharacterModal,

  //Hooks
  useFetchCharacters,
  useSyncSearchParams,
  useFetchUserUUID,

  //Pagination
  Pagination,

  //Create
  CharacterForm,
  FormActions,
  TokenSummary,
  VisibilityCheckboxes,
   ImageUpload,
 
  //Dropdowns
  AISelectDropdown,
  GenderDropdown,
  DropdownField,
  LanguageDropdown,
  
  //WindowAlert
  WindowAlert,

  //Spinner
  ChatPageSpinner,
  Spinner,
  SettingsPageLoader,

  // Chat
  ChatContainer,
  PreviousChat,
  Menu,
  ChatMain,

  //Slider
  SliderComponent,

  // UI/UX components
  CharacterCard,
  LoadMore,
  SkeletonCard,
  CustomButton,
  FeatureCard,
  PersonaCard,

  //Fields
  CheckboxField,
  CustomModelFields,
  RequiredFieldsPopup,

  //Selectors
  ModelSelection,

  //Inputs
  InputField,

  //Buttons
  GenerateButton,
  CreateButton,

  //Dropzone
  Dropzone,

  //List
  PersonaList,
  CharacterList,

  // Sidebar
  Sidebar,
  MobileSidebar,
  SettingsSidebar,
  CommunityGuidelines,

  //Textareas
  Textarea,

  // Modals
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

  // Cards
  Card,
  CardContent,
  CardTitle,
  CardHeader,

  // Image Uploader
  ImageUploader,

  // Persona
  Persona,
};

// Had to organize everything else i would go insane when looking at everything compiled into one
