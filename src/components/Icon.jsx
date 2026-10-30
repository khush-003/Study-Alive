import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight, faArrowTrendUp, faBell, faBolt, faBookOpen, faBrain, faBriefcase,
  faBullseye, faChartLine, faCheck, faChevronRight, faCirclePlay, faClipboard, faCode,
  faCodeCompare, faCompass, faDatabase, faDownload, faEarthAmericas, faFileArrowUp,
  faFilePdf, faGear, faGraduationCap, faHeartPulse, faHouseChimney, faLightbulb,
  faMagnifyingGlass, faPenNib, faPlay, faRobot, faSeedling, faShieldHalved,
  faSpinner, faUser, faUserGroup, faWandMagicSparkles, faXmark, faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

const icons = {
  faArrowRight, faArrowTrendUp, faBell, faBolt, faBookOpen, faBrain, faBriefcase, faBullseye,
  faChartLine, faCheck, faChevronRight, faCirclePlay, faClipboard, faCode, faCodeCompare, faCompass,
  faDatabase, faDownload, faEarthAmericas, faFileArrowUp, faFilePdf, faGear, faGraduationCap, faHeartPulse,
  faHouseChimney, faLightbulb, faMagnifyingGlass, faPenNib, faPlay, faRobot,
  faSeedling, faShieldHalved, faSpinner, faUser, faUserGroup,
  faWandMagicSparkles, faXmark, faArrowRightFromBracket,
};

export default function Icon({ name, className = '' }) {
  return <FontAwesomeIcon icon={icons[name] || faSeedling} className={className} />;
}
