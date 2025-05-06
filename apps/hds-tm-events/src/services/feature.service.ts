import { Injectable } from '@angular/core'
import { FeatureToggle, FeatureToggles, FeatureToggleSettings } from 'src/domain/feature'

export interface FeatureToggleState extends FeatureToggleSettings {
  name: FeatureToggle
  enabled: boolean
  enabledLocally: boolean
}

@Injectable({ providedIn: 'root' })
export class FeatureService {
  #togglePrefix = 'hd.feature'

  constructor() {}

  isEnabled(feature: FeatureToggle): boolean {
    return this.isOverridden(feature) || this.isEnabledLocally(feature)
  }

  isOverridden(feature: FeatureToggle): boolean {
    return FeatureToggles[feature].override
  }

  isEnabledLocally(feature: FeatureToggle): boolean {
    return localStorage.getItem(`${this.#togglePrefix}.${feature}`) === 'true'
  }

  enable(feature: FeatureToggle): void {
    localStorage.setItem(`${this.#togglePrefix}.${feature}`, 'true')
  }

  disable(feature: FeatureToggle): void {
    localStorage.removeItem(`${this.#togglePrefix}.${feature}`)
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
