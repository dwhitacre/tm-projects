import { Component, NgModule } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { StoreService } from 'src/services/store.service'
import { CommonModule } from '@angular/common'
import { PositionPipe } from 'src/pipes/position.pipe'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { SelectButtonModule } from 'primeng/selectbutton'
import { TagModule } from 'primeng/tag'
import { InputSwitchModule } from 'primeng/inputswitch'
import { Player } from 'src/domain/player'
import { Match } from 'src/domain/match'

@Component({
  selector: 'weekly',
  template: `
    <layout>
      <div class="loading" *ngIf="storeService.loading$ | async; else weekly">
        <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
      </div>
      <ng-template #weekly>
        <ng-container *ngIf="storeService.weeklyVm$ | async as vm">
          <div class="weekly-header">
            <div class="weekly-header-leftside">
              <p-dropdown
                [options]="vm.weeklyIds"
                [ngModel]="vm.selectedWeekly"
                (onChange)="storeService.updateSelectedWeekly($event.value)"
              />
              <p-tag *ngIf="!vm.published" severity="primary" value="Unpublished" />
            </div>
            <div class="weekly-header-buffer"></div>
            <div class="weekly-header-buffer"></div>
            <div class="weekly-header-rightside">
              <p-inputSwitch *ngIf="vm.isAdmin" [(ngModel)]="editMode" />
              <p-selectButton
                [options]="viewOptions"
                [(ngModel)]="currentView"
                optionLabel="label"
                optionValue="value"
              />
            </div>
          </div>
          <ng-container *ngIf="vm.found; else weeklynotfound">
            <ng-container *ngIf="currentView === 'results'; else matches">
              <div class="maps" *ngIf="vm.top!.length < 1">
                <tops-grid
                  *ngIf="vm.maps!.length > 0"
                  [tops]="vm.maps!"
                  [showPositions]="false"
                  [showScores]="false"
                  [isTmText]="true"
                ></tops-grid>
              </div>
              <tops-grid [tops]="vm.top!"></tops-grid>
              <tops-table
                [tops]="vm.bottom!"
                [playercount]="vm.playercount!"
                [lastModified]="vm.lastModified"
              ></tops-table>
              <div class="maps" *ngIf="vm.top!.length > 0">
                <tops-grid
                  *ngIf="vm.maps!.length > 0"
                  [tops]="vm.maps!"
                  [showPositions]="false"
                  [showScores]="false"
                  [isTmText]="true"
                ></tops-grid>
              </div>
            </ng-container>
            <ng-template #matches>
              <match-bracket
                [matches]="vm.matches!"
                [players]="vm.players || []"
                [editable]="!!vm.isAdmin && editMode"
              ></match-bracket>
              <tops-table
                label="{{ vm.qualifying!.type | titlecase }} {{ vm.qualifying!.instance | uppercase }}"
                [tops]="vm.qualifying!.results"
                [playercount]="vm.qualifying!.results.length"
                [lastModified]="vm.lastModified"
                [editable]="!!vm.isAdmin && editMode"
                [players]="vm.players || []"
                (addedMatchResult)="addMatchResult(vm.qualifying!, $event)"
                (updatedMatchResult)="updateMatchResult(vm.qualifying!, $event)"
                (deleteMatchResult)="deleteMatchResult(vm.qualifying!, $event)"
              ></tops-table>
            </ng-template>
          </ng-container>
          <ng-template #weeklynotfound>
            <div class="weekly-not-found">No weekly found for id: {{ vm.selectedWeekly }}</div>
          </ng-template>
        </ng-container>
      </ng-template>
    </layout>
  `,
  styles: [
    `
      .loading,
      .weekly-not-found {
        display: flex;
        justify-content: center;
      }

      .maps {
        margin-top: 48px;
        margin-bottom: 24px;
      }

      .weekly-header,
      .weekly-matches {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(4, 268px);
        grid-column-gap: 24px;
        grid-row-gap: 24px;
      }

      .weekly-header-leftside {
        display: flex;
        justify-content: flex-start;
        gap: 8px;
        align-items: center;
      }

      .weekly-header-rightside {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        align-items: center;
      }

      .weekly-header {
        grid-row-gap: 8px;
        margin-bottom: 24px;
      }

      @media (max-width: 1268px) {
        .weekly-header,
        .weekly-matches {
          grid-template-columns: repeat(2, 268px);
        }

        .weekly-header-buffer {
          display: none;
        }
      }

      @media (max-width: 624px) {
        .weekly-header,
        .weekly-matches {
          grid-template-columns: repeat(1, 268px);
        }

        .weekly-header-rightside {
          justify-content: flex-start;
        }
      }
    `,
  ],
})
export class WeeklyComponent {
  viewOptions = [
    { label: 'Results', value: 'results' },
    { label: 'Matches', value: 'matches' },
  ]
  currentView = 'results'

  editMode = false

  constructor(public storeService: StoreService) {}

  addMatchResult(match: Match, player?: Player) {
    if (!player) return
    this.storeService.addMatchResult([match.matchId, player.accountId])
  }

  updateMatchResult(match: Match, { player, score }: { player: Player; score: number }) {
    this.storeService.updateMatchResult([match.matchId, player.accountId, score])
  }

  deleteMatchResult(match: Match, player: Player) {
    this.storeService.deleteMatchResult([match.matchId, player.accountId])
  }
}

@NgModule({
  exports: [WeeklyComponent],
  declarations: [WeeklyComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    PositionPipe,
    DropdownModule,
    FormsModule,
    SelectButtonModule,
    TagModule,
    InputSwitchModule,
  ],
})
export class WeeklyModule {}
