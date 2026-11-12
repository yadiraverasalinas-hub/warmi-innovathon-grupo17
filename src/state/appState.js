export const appState = {
  mode: 'app',
  tab: 'home',
  recipeId: null,
  category: 'Todas',
  query: '',
  favorites: [],
  profile: { trustedRecipeId: null, contacts: [] },
  showAllShops: true,
  selectedPoint: null,
  modal: null,
  chat: [],
  location: null,
  shareDraft: null,
  setupStep: 0,
  setupRecipeId: null,
  setupContacts: [{ name: '', phone: '' }, { name: '', phone: '' }, { name: '', phone: '' }],
  setupError: '',
  demoStep: 0
};

export function resetTransientState() {
  appState.tab = 'home';
  appState.recipeId = null;
  appState.category = 'Todas';
  appState.query = '';
  appState.selectedPoint = null;
  appState.modal = null;
  appState.chat = [];
  appState.location = null;
  appState.shareDraft = null;
  appState.setupStep = 0;
  appState.setupRecipeId = null;
  appState.setupContacts = [{ name: '', phone: '' }, { name: '', phone: '' }, { name: '', phone: '' }];
  appState.setupError = '';
}
