import 'server-only';

import { createI18nServerInstance } from './i18n.server';

type LayoutOrPageComponent<Params> = React.ComponentType<Params>;

export function withI18n<Params extends object>(
  Component: LayoutOrPageComponent<Params>,
) {
  async function I18nServerComponentWrapper(params: Params) {
    await createI18nServerInstance();

    return <Component {...params} />;
  }

  // Preserve the original component name for better debugging
  I18nServerComponentWrapper.displayName = `withI18n(${Component.displayName || Component.name || 'Component'})`;

  return I18nServerComponentWrapper;
}
