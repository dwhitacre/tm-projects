export enum FeatureToggle {
  homepage = 'homepage',
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
}
