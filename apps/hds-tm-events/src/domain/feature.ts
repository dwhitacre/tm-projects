export enum FeatureToggle {
  homepage = 'homepage',
  urlOverlay = 'url-overlay',
  developerTrace = 'developer-trace',
}

export interface FeatureToggleSettings {
  description: string
  override: boolean
}

export const FeatureToggles: Record<FeatureToggle, FeatureToggleSettings> = {
  [FeatureToggle.homepage]: {
    description: 'Make the homepage the default page',
    override: true,
  },
  [FeatureToggle.urlOverlay]: {
    description: 'Show the URL overlay on posts and events',
    override: false,
  },
  [FeatureToggle.developerTrace]: {
    description: 'Enable developer trace logging',
    override: false,
  },
}

export const togglePrefix = 'hd.feature'

export function isEnabled(feature: FeatureToggle): boolean {
  return isOverridden(feature) || isEnabledLocally(feature)
}

export function isOverridden(feature: FeatureToggle): boolean {
  return FeatureToggles[feature].override
}

export function isEnabledLocally(feature: FeatureToggle): boolean {
  return localStorage.getItem(`${togglePrefix}.${feature}`) === 'true'
}
