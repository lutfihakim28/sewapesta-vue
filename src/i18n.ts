/**
 * source: https://github.com/intlify/vue-i18n/blob/master/examples/lazy-loading/vite/src/i18n.ts
 */

import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

import type { I18n, I18nOptions, Locale } from 'vue-i18n'
import { STORAGE_LOCALE_KEY } from './utils/constants/locales'

let locale = localStorage.getItem(STORAGE_LOCALE_KEY);

if (!locale) {
  localStorage.setItem(STORAGE_LOCALE_KEY, 'en');
  locale = 'en';
}

export const i18n = setupI18n({
  legacy: false,
  locale: locale,
  availableLocales: ['en', 'id'],
})

export const SUPPORT_LOCALES = ['en', 'id']

export function getLocale(): string {
  return typeof i18n.global.locale === 'string' ? i18n.global.locale : i18n.global.locale.value;
}

export function setLocale(_i18n: I18n, locale: Locale): void {
  if (typeof _i18n.global.locale === 'string') {
    _i18n.global.locale = locale
  } else {
    _i18n.global.locale.value = locale
  }
}

export function setupI18n(options: I18nOptions = { locale: 'en' }): I18n {
  const _i18n = createI18n(options)
  setI18nLanguage(_i18n, options.locale!)
  return _i18n
}

export function setI18nLanguage(_i18n: I18n, locale: Locale): void {
  setLocale(_i18n, locale)
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')!.setAttribute('lang', locale)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResourceMessages = (r: any) => r.default || r

export async function loadLocaleMessages(_i18n: I18n, locale: Locale) {
  // load locale messages
  const messages = await import(`./locales/${locale}.json`).then(
    getResourceMessages
  )

  // set locale and locale message
  _i18n.global.setLocaleMessage(locale, messages)

  return nextTick()
}
