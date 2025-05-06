import { Injectable } from '@angular/core'
import {
  FeatureToggle,
  FeatureToggles,
  FeatureToggleSettings,
  isEnabled,
  isEnabledLocally,
  isOverridden,
  togglePrefix,
} from 'src/domain/feature'

export interface FeatureToggleState extends FeatureToggleSettings {
  name: FeatureToggle
  enabled: boolean
  enabledLocally: boolean
}

@Injectable({ providedIn: 'root' })
export class FeatureService {
  constructor() {}

  isEnabled(feature: FeatureToggle): boolean {
    return isEnabled(feature)
  }

  isOverridden(feature: FeatureToggle): boolean {
    return isOverridden(feature)
  }

  isEnabledLocally(feature: FeatureToggle): boolean {
    return isEnabledLocally(feature)
  }

  enable(feature: FeatureToggle): void {
    localStorage.setItem(`${togglePrefix}.${feature}`, 'true')
  }

  disable(feature: FeatureToggle): void {
    localStorage.removeItem(`${togglePrefix}.${feature}`)
  }

  toggle(feature: FeatureToggle): void {
    if (this.isEnabledLocally(feature)) {
      return this.disable(feature)
    }

    this.enable(feature)
  }

  getAll(): FeatureToggleState[] {
    return Object.entries(FeatureToggles).map(([key, value]) => {
      const feature = key as FeatureToggle
      return {
        name: feature,
        description: value.description,
        override: value.override,
        enabled: this.isEnabled(feature),
        enabledLocally: this.isEnabledLocally(feature),
      }
    })
  }
}
