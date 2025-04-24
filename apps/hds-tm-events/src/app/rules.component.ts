import { Component, NgModule } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { CommonModule } from '@angular/common'
import { FieldsetModule } from 'primeng/fieldset'
import { StoreService } from 'src/services/store.service'

@Component({
  selector: 'rules',
  template: `
    <layout>
      <ng-container *ngIf="storeService.rules$ | async as rules">
        <ng-container *ngFor="let ruleCategory of rules">
          <p-fieldset *ngIf="ruleCategory.isVisible" [legend]="ruleCategory.name" [toggleable]="true">
            <ng-container *ngFor="let rule of ruleCategory.rules">
              <p *ngIf="rule.isVisible">{{ rule.content }}</p>
            </ng-container>
          </p-fieldset>
        </ng-container>
      </ng-container>
    </layout>
  `,
  styles: [
    `
      p {
        text-align: center;
      }

      :host ::ng-deep .p-fieldset-legend a {
        color: var(--primary-color);
      }
    `,
  ],
})
export class RulesComponent {
  constructor(public storeService: StoreService) {}
}

@NgModule({
  exports: [RulesComponent],
  declarations: [RulesComponent],
  imports: [CommonModule, ComponentsModule, FieldsetModule],
})
export class RulesModule {}
