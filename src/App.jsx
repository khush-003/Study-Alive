import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import AiCounselorDrawer from './components/ai/AiCounselorDrawer.jsx';
import AiFab from './components/ai/AiFab.jsx';
import AuthModal from './components/modals/AuthModal.jsx';
import AiStudyModal from './components/modals/AiStudyModal.jsx';
import OnboardingModal from './components/modals/OnboardingModal.jsx';
import ResourceRequestModal from './components/modals/ResourceRequestModal.jsx';
import ShareSkillModal from './components/modals/ShareSkillModal.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Toast from './components/layout/Toast.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider, useToast } from './context/ToastContext.jsx';
import { UiProvider } from './context/UiContext.jsx';
import useUi from './hooks/useUi.js';
import useAuthGate from './hooks/useAuthGate.js';
import useGemini from './hooks/useGemini.js';
import { publishSkillOffer } from './services/communityService.js';
import { submitResourceRequest } from './services/studyService.js';
import ComparePage from './pages/Compare.jsx';
import CommunityPage from './pages/Community.jsx';
import ExplorePage from './pages/Explore.jsx';
import HomePage from './pages/Home.jsx';
import ProfilePage from './pages/Profile.jsx';
import StudyPage from './pages/Study.jsx';
import UpdatesPage from './pages/Updates.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  // This effect resets scrolling whenever navigation changes the current route.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout() {
  const navigate = useNavigate();
  // This state shares the current career selection with the routed page content.
  const [selectedCareerId, setSelectedCareerId] = useState('cs');
  // This state stores the current AI career comparison result.
  const [compareAnalysis, setCompareAnalysis] = useState('');
  const [publishedOffers, setPublishedOffers] = useState([]);
  const { user, authModal, openAuthModal, closeAuthModal, logout } = useAuth();
  const { showToast } = useToast();
  const { openModal, closeModal, isModalOpen } = useUi();
  const gate = useAuthGate();
  const gemini = useGemini();

  // This handler relays AI failures to the app-wide notification system.
  const requestAi = async (prompt, useSearch = false) => {
    try {
      return (await gemini.ask(prompt, useSearch)).text;
    } catch (error) {
      showToast(error.response?.data?.message || (error instanceof Error ? error.message : 'Unable to reach the AI service.'), 'error');
      return '';
    }
  };
  // This handler ends the session and announces guest browsing mode.
  const handleLogout = () => {
    logout();
    showToast('Logged out. You are now exploring as a guest.');
  };
  // This handler updates the career selection and navigates to its parameterized route.
  const selectCareer = (careerId) => {
    setSelectedCareerId(careerId);
    navigate(`/explore/${careerId}`);
  };
  // This handler opens the AI drawer only after the auth gate succeeds.
  const openCounselor = () => gate(() => openModal('counselor'), 'Register to get unlimited AI career advice!');
  // These handlers gate each global modal before opening it.
  const openAiStudy = () => gate(() => openModal('study'), 'Register to generate custom AI study kits and cheat sheets!');
  const openResourceRequest = () => gate(() => openModal('resource'), 'Register to request specific study resources!');
  const openShareSkill = () => gate(() => openModal('share'), 'Register to share a skill with the student community!');
  // This handler adds a submitted offer to the signed-in student's peer list.
  const createSkillOffer = async (offer) => {
    const savedOffer = await publishSkillOffer(offer);
    const owner = user?.name ?? 'Learner';
    const publishedOffer = {
      id: savedOffer.id,
      offerId: savedOffer.id,
      userId: savedOffer.userId,
      owner,
      ownerEmail: user?.email,
      name: owner,
      teaches: savedOffer.teach,
      wantsToLearn: savedOffer.learn,
      avatar: user?.avatarUrl || '',
      isCurrentUser: true,
    };
    setPublishedOffers((current) => [publishedOffer, ...current]);
  };
  // This handler requests a protected comparison of the exact selected career pair.
  const analyzeCareers = (firstCareer, secondCareer) => gate(async () => {
    setCompareAnalysis('');
    try {
      const result = await gemini.compare(firstCareer, secondCareer);
      setCompareAnalysis(result.text);
    } catch (error) {
      showToast(error.response?.data?.message || (error instanceof Error ? error.message : 'Unable to reach the AI service.'), 'error');
    }
  }, 'Register your student name to analyze careers with AI!');

  const routeContext = {
    user, selectedCareerId, openAuthModal, showToast, gate, selectCareer,
    openCounselor, openAiStudy, openResourceRequest, openShareSkill, requestAi,
    analyzeCareers, compareAnalysis, gemini, clearCompareAnalysis: () => setCompareAnalysis(''),
    handleLogout, publishedOffers,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans text-content-body antialiased selection:bg-brand-100 selection:text-brand-700">
      <ScrollToTop />
      <Header onCounselor={openCounselor} onWalkthrough={() => openModal('onboarding')} onLogout={handleLogout} />
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-6 sm:px-6 lg:px-8"><Outlet context={routeContext} /></main>
      <Footer />
      <Toast />
      <AiFab />
      <AuthModal open={authModal.open} mode={authModal.mode} subtitle={authModal.subtitle} onClose={closeAuthModal} onModeChange={openAuthModal} onSuccess={() => showToast(authModal.mode === 'edit' ? 'Profile details updated.' : 'Welcome to skill2career!')} />
      <OnboardingModal open={isModalOpen('onboarding')} onClose={closeModal} />
      <ShareSkillModal open={isModalOpen('share')} onClose={closeModal} onToast={showToast} onSubmit={createSkillOffer} />
      <ResourceRequestModal open={isModalOpen('resource')} onClose={closeModal} onToast={showToast} onSubmit={async (request) => {
        await submitResourceRequest(request);
        showToast(`Resource request for "${request.subject}" (${request.format}) submitted!`);
      }} />
      <AiStudyModal open={isModalOpen('study')} onClose={closeModal} />
      <AiCounselorDrawer open={isModalOpen('counselor')} user={user} onClose={closeModal} requestAi={requestAi} />
    </div>
  );
}

function RoutePage({ render }) {
  const context = useOutletContext();
  const params = useParams();
  return render(context, params);
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <UiProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<RoutePage render={(context) => <HomePage user={context.user} onAuth={context.openAuthModal} onCounselor={context.openCounselor} onSelectCareer={context.selectCareer} />} />} />
                <Route path="explore/:careerId?" element={<ExplorePage />} />
                <Route path="compare" element={<ComparePage />} />
                <Route path="study" element={<StudyPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="updates" element={<UpdatesPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </UiProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
