import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advanceTutorial,
  getTutorialTargetSelector,
  previousTutorialStep,
  snapshotTutorialView
} from '../src/state/tutorial.js';

function createTutorialState(overrides = {}) {
  return {
    tutorialActive: true,
    tutorialStep: 0,
    tutorialHistory: [],
    profile: { trustedRecipeId: 'lomo', contacts: [] },
    supportUnlocked: false,
    tab: 'home',
    recipeId: null,
    modal: null,
    shareDraft: null,
    portionInput: '',
    portionResults: null,
    ...overrides
  };
}

test('only the expected navigation action advances the tutorial', () => {
  const state = createTutorialState();

  assert.equal(advanceTutorial(state, 'navigate', { tab: 'search' }), false);
  assert.equal(advanceTutorial(state, 'demo-next'), false);
  assert.equal(state.tutorialStep, 0);
  assert.equal(advanceTutorial(state, 'navigate', { tab: 'fav' }), true);
  assert.equal(state.tutorialStep, 1);
});

test('the recipe and calculator steps require the configured recipe', () => {
  const state = createTutorialState({ tutorialStep: 1 });

  assert.equal(advanceTutorial(state, 'open-recipe', { id: 'ceviche' }), false);
  assert.equal(advanceTutorial(state, 'open-recipe', { id: 'lomo' }), true);
  state.tutorialStep = 2;
  assert.equal(advanceTutorial(state, 'open-portion-calculator', { id: 'lomo' }), true);
});

test('the PIN step advances only after the normal app unlocks support mode', () => {
  const state = createTutorialState({ tutorialStep: 3 });

  assert.equal(advanceTutorial(state, 'pin-unlocked'), false);
  state.supportUnlocked = true;
  assert.equal(advanceTutorial(state, 'pin-unlocked'), true);
});

test('the previous control restores the real app view from before the action', () => {
  const state = createTutorialState();
  const beforeAction = snapshotTutorialView(state);
  state.tab = 'fav';

  assert.equal(advanceTutorial(state, 'navigate', { tab: 'fav' }, beforeAction), true);
  assert.equal(previousTutorialStep(state), true);
  assert.equal(state.tutorialStep, 0);
  assert.equal(state.tab, 'home');
  assert.equal(previousTutorialStep(state), false);
});

test('going back from the PIN step restores the calculator before unlock', () => {
  const state = createTutorialState({
    tutorialStep: 3,
    modal: 'portion-calculator',
    recipeId: 'lomo'
  });
  const beforeUnlock = snapshotTutorialView(state);
  state.supportUnlocked = true;
  state.modal = null;
  state.recipeId = null;
  state.tab = 'home';

  assert.equal(advanceTutorial(state, 'pin-unlocked', {}, beforeUnlock), true);
  assert.equal(previousTutorialStep(state), true);
  assert.equal(state.supportUnlocked, false);
  assert.equal(state.modal, 'portion-calculator');
  assert.equal(state.recipeId, 'lomo');
});

test('recipient selection advances only from the recipe-sharing preview', () => {
  const state = createTutorialState({ tutorialStep: 11 });

  assert.equal(advanceTutorial(state, 'recipient-selected'), false);
  state.shareDraft = { recipeId: 'lomo', mode: 'recipe' };
  assert.equal(advanceTutorial(state, 'recipient-selected'), true);
  assert.equal(state.tutorialStep, 12);
});

test('stores and wellbeing require navigating to their real tabs and reading the explanations', () => {
  const state = createTutorialState({ tutorialStep: 4 });

  assert.equal(getTutorialTargetSelector(state), '[data-action="navigate"][data-tab="shop"]');
  assert.equal(advanceTutorial(state, 'navigate', { tab: 'fav' }), false);
  assert.equal(advanceTutorial(state, 'navigate', { tab: 'shop' }), true);
  assert.equal(state.tutorialStep, 5);
  assert.equal(getTutorialTargetSelector(state), '[aria-labelledby="shops-title"] .banner');
  assert.equal(advanceTutorial(state, 'navigate', { tab: 'well' }), false);
  assert.equal(advanceTutorial(state, 'tutorial-continue'), true);
  assert.equal(state.tutorialStep, 6);
  assert.equal(getTutorialTargetSelector(state), '[data-action="navigate"][data-tab="well"]');
  assert.equal(advanceTutorial(state, 'navigate', { tab: 'well' }), true);
  assert.equal(state.tutorialStep, 7);
  assert.equal(getTutorialTargetSelector(state), '#wellbeing-title');
  assert.equal(advanceTutorial(state, 'tutorial-continue'), true);
  assert.equal(state.tutorialStep, 8);
});

test('tutorial highlights the live control for the current step', () => {
  const state = createTutorialState();

  assert.equal(getTutorialTargetSelector(state), '[data-action="navigate"][data-tab="fav"]');
  state.tutorialStep = 3;
  assert.equal(
    getTutorialTargetSelector(state),
    '#portion-count, [data-form="portion-calculator"] button[type="submit"]'
  );
  state.tutorialStep = 12;
  assert.equal(getTutorialTargetSelector(state), null);
});
