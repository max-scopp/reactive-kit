import { ApplicationInitStatus, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectStorage } from './inject-storage';

function shortId() {
  return [...Array(16)].map(() => Math.random().toString(36)[2]).join('');
}

describe('injectStorage', () => {
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({});

    const initStatus = TestBed.inject(ApplicationInitStatus);
    await initStatus.donePromise;
  });

  test('signal can be created', async () => {
    const STORAGE_KEY = shortId();

    const INITIAL = 123;

    const mySignal = injectStorage(() => ({
      storageKey: STORAGE_KEY,
      initialValue: INITIAL,
    }));

    expect(mySignal()).toEqual(INITIAL);
  });

  test('options can change', async () => {
    const STORAGE_KEY = shortId();
    const STORAGE_KEY2 = shortId();

    const INITIAL = 123;
    const INVALID = 321;

    const storageKey = signal(STORAGE_KEY);

    const mySignal = injectStorage(() => ({
      storageKey: storageKey(),
      initialValue: INITIAL,
    }));

    mySignal.set(INVALID);
    storageKey.set(STORAGE_KEY2);

    expect(mySignal()).toEqual(INITIAL);
  });

  test('signal is being persisted', async () => {
    const STORAGE_KEY = shortId();

    const INITIAL = 123;
    const EXPECTED = 321;

    const mySignal = injectStorage(() => ({
      storageKey: STORAGE_KEY,
      initialValue: INITIAL,
    }));

    mySignal.set(EXPECTED);

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(EXPECTED);
  });

  test('signal reacts to outside changes', async () => {
    const STORAGE_KEY = shortId();

    const INITIAL = 123;
    const EXPECTED = 321;

    const mySignal = injectStorage(() => ({
      storageKey: STORAGE_KEY,
      initialValue: INITIAL,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(EXPECTED));

    expect(mySignal()).toEqual(EXPECTED);
  });

  test('signal is being persisted (sessionStorage)', async () => {
    const STORAGE_KEY = shortId();

    const INITIAL = 123;
    const EXPECTED = 321;

    const mySignal = injectStorage(() => ({
      bucket: 'sessionStorage',
      storageKey: STORAGE_KEY,
      initialValue: INITIAL,
    }));

    mySignal.set(EXPECTED);

    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY)!)).toEqual(EXPECTED);
  });

  test('signal reacts to outside changes (sessionStorage)', async () => {
    const STORAGE_KEY = shortId();

    const INITIAL = 123;
    const EXPECTED = 321;

    const mySignal = injectStorage(() => ({
      bucket: 'sessionStorage',
      storageKey: STORAGE_KEY,
      initialValue: INITIAL,
    }));

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(EXPECTED));

    expect(mySignal()).toEqual(EXPECTED);
  });
});
