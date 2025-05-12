export enum FeatureToggle {
  homepage = 'homepage',
  urlOverlay = 'url-overlay',
}

export interface FeatureToggleSettings {
  description: string
  override: boolean
}

export const FeatureToggles: Record<FeatureToggle, FeatureToggleSettings> = {
  [FeatureToggle.homepage]: {
    description: 'Make the homepage the default page',
    override: false,
  },
  [FeatureToggle.urlOverlay]: {
    description: 'Show the URL overlay on posts and events',
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
