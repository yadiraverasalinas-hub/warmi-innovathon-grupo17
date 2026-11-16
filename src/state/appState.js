export const appState = {
  mode: 'app',
  tab: 'home',
  recipeId: null,
  category: 'Todas',
  query: '',
  favorites: [],
  profile: { trustedRecipeId: null, contacts: [] },
  hasSupportPin: false,
  showAllShops: true,
  selectedPoint: null,
  modal: null,
  chat: [],
  supportUnlocked: false,
  location: null,
  shareDraft: null,
  setupStep: 0,
  tutorialActive: false,
  tutorialStep: 0,
  tutorialHistory: [],
  setupRecipeId: null,
  setupContacts: [{ name: '', phone: '' }, { name: '', phone: '' }],
  setupError: '',
  setupPin: '',
  setupPinConfirm: '',
  preferences: { theme: 'light', fontSize: 'normal', recipeLayout: 'grid', name: '' },
  portionInput: '',
  portionResults: null,
  timerDeadline: null,
  timerRecipeId: null,
  checkin: null,
  costs: { recipeId: null, values: [] }
};

export function resetTransientState() {
  appState.tab = 'home';
  appState.recipeId = null;
  appState.category = 'Todas';
  appState.query = '';
  appState.selectedPoint = null;
  appState.modal = null;
  appState.chat = [];
  appState.supportUnlocked = false;
  appState.location = null;
  appState.shareDraft = null;
  appState.setupStep = 0;
  appState.tutorialActive = false;
  appState.tutorialStep = 0;
  appState.tutorialHistory = [];
  appState.setupRecipeId = null;
  appState.setupContacts = [{ name: '', phone: '' }, { name: '', phone: '' }];
  appState.setupError = '';
  appState.setupPin = '';
  appState.setupPinConfirm = '';
  appState.portionInput = '';
  appState.portionResults = null;
  appState.timerDeadline = null;
  appState.timerRecipeId = null;
  appState.checkin = null;
  appState.costs = { recipeId: null, values: [] };
}
