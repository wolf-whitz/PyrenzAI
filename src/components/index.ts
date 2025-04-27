// Layout Components
import Banner from '@layout/Banner/Banner';
import Footer from '@layout/Footer/Footer';
import PreviewFooter from '@layout/Footer/PreviewFooter';
import SearchBar from '@layout/SearchBar/SearchBar';
import PreviewHeader from '@layout/Header/PreviewHeader';

// Sidebar Components
import Sidebar from '@layout/Sidebar/sidebar';
import DesktopSidebar from '@layout/Sidebar/DesktopSidebar';
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
import DropdownField from '@ui/Dropdown/DropdownField';
import CheckboxField from '@ui/Input/CheckBox';
import InputField from '@ui/Input/InputField';

// Textrea
import Textarea from '@ui/Textarea/Textarea';

// Image Uploader
import ImageUploader from '@ui/ImageUploader/ImageUploader';

// Dropzone
import Dropzone from '@ui/Dropzone/Dropzone';

// Chat Components
import ChatContainer from '@ui/Chats/Container/ChatContainer';
import PreviousChat from '@ui/Chats/menu/PreviousMessageContainer';
import Menu from '@ui/Chats/menu/Menu';
import ChatMain from '@ui/Chats/main/Chatmain';

// Create Component
import CharacterForm from '@ui/Form/CharacterForm';
import RequiredFieldsPopup from '@ui/Fields/RequiredFieldsPopup';
import FormActions from '@ui/Actions/FormActions';
import TokenSummary from '@ui/Summary/TokenSummary';
import VisibilityCheckboxes from '@ui/CheckBox/VisibilityCheckboxes';
import GenderDropdown from '@ui/Dropdown/GenderDropdown';
import ImageUpload from '@ui/ImageUploader/ImageUpload';

// UI Components
import CharacterCard from '@ui/Cards/CharacterCard';
import LoadMore from '@ui/LoadMore/LoadMoreButton';
import SkeletonCard from '@ui/Skeleton/SkeletonCard';
import CustomButton from '@ui/Buttons/Buttons';

// Modal Components
import CharacterCardModal from '@ui/Modal/CharacterCardModal';
import RegisterModal from '@ui/Modal/Auth/RegisterModal';
import LoginModal from '@ui/Modal/Auth/Loginmodal';
import DownloadModal from '@ui/Modal/DownloadsModal';
import LanguageModal from '@ui/Modal/LanguageModal';

// Card Components
import { Card, CardContent, CardTitle, CardHeader } from '@ui/ShadCdn/card';

// Persona Components
import Persona from '@ui/Persona/Persona';

export {
  // Layout
  Banner,
  Footer,
  SearchBar,
  PreviewHeader,
  PreviewFooter,

  //Create
  CharacterForm,
  RequiredFieldsPopup,
  FormActions,
  TokenSummary,
  VisibilityCheckboxes,
  GenderDropdown,
  ImageUpload,

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

  // UI
  CharacterCard,
  LoadMore,
  SkeletonCard,
  CustomButton,

  //Fields
  CheckboxField,
  DropdownField,

  //Inputs
  InputField,

  //Buttons
  GenerateButton,
  CreateButton,

  //Dropzone
  Dropzone,

  // Sidebar
  Sidebar,
  DesktopSidebar,
  MobileSidebar,
  SettingsSidebar,
  CommunityGuidelines,

  //Textareas
  Textarea,

  // Modals
  CharacterCardModal,
  RegisterModal,
  LoginModal,
  DownloadModal,
  LanguageModal,

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
