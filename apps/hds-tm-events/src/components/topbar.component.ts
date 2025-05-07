import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { BehaviorSubject, combineLatest, map, Subject, takeUntil } from 'rxjs'
import { StoreService } from 'src/services/store.service'
import { Map } from 'src/domain/map'
import { FeatureToggleState } from 'src/services/feature.service'
import { FeatureToggle, isEnabled } from 'src/domain/feature'

export interface MenuItemExtended extends MenuItem {
  weeklyOnly: boolean
  adminOnly: boolean
  homeOnly?: boolean
}

@Component({
  selector: 'topbar',
  standalone: false,
  template: `
    <div class="layout-topbar">
      <a class="layout-topbar-logo" routerLink="/">
        <img src="assets/images/holydynasty.png" alt="logo" height="32" />
        <span class="layout-topbar-title">{{ title }}</span>
      </a>
      <div class="layout-topbar-menu">
        <ng-container *ngFor="let menuItem of menuItems$ | async">
          <div *ngIf="menuItem.visible" class="layout-topbar-menu-standalone" [ngClass]="menuItem.styleClass">
            <p-button
              [icon]="menuItem.icon"
              [text]="true"
              [label]="menuItem.label"
              iconPos="right"
              (onClick)="(menuItem.command || noop)({})"
              [routerLink]="menuItem.routerLink"
            ></p-button>
          </div>
        </ng-container>
        <div class="layout-topbar-menu-menuitem">
          <p-menu #menu [model]="(menuItems$ | async) ?? undefined" [popup]="true" [appendTo]="menubutton" />
          <p-button #menubutton (click)="menu.toggle($event)" icon="pi pi-cog" [text]="true" />
        </div>
      </div>
    </div>

    <p-dialog
      header="Enter Admin Key"
      [modal]="true"
      [(visible)]="adminkeyVisible"
      position="topright"
      [draggable]="false"
      [style]="{ width: '25rem' }"
    >
      <div class="layout-dialog-input">
        <input pInputText #adminkey type="password" autocomplete="off" />
      </div>
      <div class="layout-dialog-actions">
        <p-button label="Cancel" severity="secondary" (click)="adminkeyVisible = false" />
        <p-button label="Enter" (click)="storeService.updateAdmin(adminkey.value); adminkeyVisible = false" />
      </div>
    </p-dialog>

    <p-dialog
      header="Enter Weekly Date"
      [modal]="true"
      [(visible)]="createWeeklyVisible"
      position="topright"
      [draggable]="false"
      [style]="{ width: '25rem' }"
    >
      <div class="layout-dialog-input">
        <p-inputMask
          [(ngModel)]="createWeeklyDate"
          mask="9999-99-99"
          [placeholder]="createWeeklyDate"
          slotChar="yyyy-mm-dd"
        />
      </div>
      <div class="layout-dialog-actions">
        <p-button label="Cancel" severity="secondary" (click)="createWeeklyVisible = false" />
        <p-button label="Create" (click)="createWeekly(createWeeklyDate)" />
      </div>
    </p-dialog>

    <p-dialog
      header="Publish Weekly"
      [modal]="true"
      [(visible)]="publishWeeklyVisible"
      position="topright"
      [draggable]="false"
      [style]="{ width: '25rem' }"
    >
      <ng-container *ngIf="storeService.selectedWeekly$ | async as selectedWeekly">
        <div class="layout-dialog-input">
          <span>
            Publish the currently selected weekly?
            <br />
            {{ selectedWeekly }}
          </span>
        </div>
        <div class="layout-dialog-actions">
          <p-button label="Cancel" severity="secondary" (click)="publishWeeklyVisible = false" />
          <p-button label="Publish" (click)="publishWeekly(selectedWeekly)" />
        </div>
      </ng-container>
    </p-dialog>

    <p-dialog
      header="Add Weekly Map"
      [modal]="true"
      [(visible)]="addWeeklyMapVisible"
      position="topright"
      [draggable]="false"
      [style]="{ width: '25rem', height: '25rem' }"
    >
      <ng-container *ngIf="storeService.selectedWeekly$ | async as selectedWeekly">
        <div class="layout-dialog-input">
          <span>
            Add map to currently selected weekly?
            <br />
            {{ selectedWeekly }}
          </span>
        </div>
        <div class="layout-dialog-input">
          <ng-container *ngIf="storeService.maps$ | async as maps">
            <p-dropdown [options]="maps" [placeholder]="'Select Map'" [(ngModel)]="addWeeklyMapSelected">
              <ng-template let-map pTemplate="selectedItem">
                <span>{{ map.name | tm: 'humanize' }}</span>
              </ng-template>
              <ng-template let-map pTemplate="item">
                <span>{{ map.name | tm: 'humanize' }}</span>
              </ng-template>
            </p-dropdown>
          </ng-container>
        </div>
        <div class="layout-dialog-actions">
          <p-button label="Cancel" severity="secondary" (click)="addWeeklyMapVisible = false" />
          <p-button label="Add" (click)="addWeeklyMap(selectedWeekly, addWeeklyMapSelected!.mapUid)" />
        </div>
      </ng-container>
    </p-dialog>

    <p-dialog
      header="Add Player"
      [modal]="true"
      [(visible)]="addPlayerVisible"
      position="topright"
      [draggable]="false"
      [style]="{ width: '25rem' }"
    >
      <div class="layout-dialog-input">
        <p-inputMask
          [(ngModel)]="addPlayerAccountId"
          mask="********-****-****-****-************"
          [placeholder]="addPlayerAccountId"
        />
      </div>
      <div class="layout-dialog-actions">
        <p-button label="Cancel" severity="secondary" (click)="addPlayerVisible = false" />
        <p-button label="Create" (click)="addPlayer(addPlayerAccountId)" />
      </div>
    </p-dialog>

    <p-dialog
      header="Add Map (uid)"
      [modal]="true"
      [(visible)]="addMapVisible"
      position="topright"
      [draggable]="false"
      [style]="{ width: '25rem' }"
    >
      <div class="layout-dialog-input">
        <input pInputText #mapUid autocomplete="off" />
      </div>
      <div class="layout-dialog-actions">
        <p-button label="Cancel" severity="secondary" (click)="addMapVisible = false" />
        <p-button label="Create" (click)="addMap(mapUid.value)" />
      </div>
    </p-dialog>

    <p-dialog
      header="Feature Toggles"
      [modal]="true"
      [(visible)]="featureTogglesVisible"
      position="center"
      [draggable]="false"
    >
      <div class="layout-dialog-input">
        <p-table [value]="featureToggles" [tableStyle]="{ 'min-width': '50rem' }">
          <ng-template #header>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Enabled?</th>
            </tr>
          </ng-template>
          <ng-template #body let-featureToggle>
            <tr>
              <td>{{ featureToggle.name }}</td>
              <td>{{ featureToggle.description }}</td>
              <td>
                <p-checkbox
                  [disabled]="featureToggle.override"
                  [(ngModel)]="featureToggle.enabled"
                  [binary]="true"
                  (change)="storeService.toggleFeature(featureToggle.name)"
                ></p-checkbox>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
      <div class="layout-dialog-actions">
        <p-button label="Close" severity="secondary" (click)="featureTogglesVisible = false" />
      </div>
    </p-dialog>
  `,
  styles: [
    `
      .layout-topbar {
        position: fixed;
        height: 4rem;
        z-index: 997;
        left: 0;
        top: 0;
        width: 100%;
        padding: 0 2rem;
        transition: left 0.2s;
        display: flex;
        align-items: center;
        box-shadow:
          0 3px 5px #00000005,
          0 0 2px #0000000d,
          0 1px 4px #00000014;
        border-bottom: 1px solid var(--p-surface-700);
        background-color: #18181b;
      }

      .layout-topbar .layout-topbar-logo {
        display: flex;
        align-items: center;
        font-size: 1rem;
        width: 250px;
        border-radius: 12px;
        color: var(--primary-color);
      }

      .layout-topbar .layout-topbar-menu {
        margin: 0 0 0 auto;
        padding: 0;
        list-style: none;
        display: flex;
        gap: 2px;
      }

      .layout-topbar .layout-topbar-menu .layout-topbar-button {
        margin-left: 1rem;
      }

      .layout-topbar .layout-topbar-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        color: var(--text-color-secondary);
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .layout-topbar-title {
        margin-left: 12px;
      }

      a {
        text-decoration: none;
      }

      .layout-dialog-input {
        display: flex;
        align-items: center;
        gap: 3rem;
        margin-bottom: 1rem;
      }

      .layout-dialog-input input {
        width: 100%;
      }

      .layout-dialog-actions {
        display: flex;
        justify-content: end;
        gap: 12px;
      }

      :host::ng-deep .p-menu {
        top: 52px !important;
        left: calc(100% - 240px) !important;
      }

      :host::ng-deep .p-button-label {
        font-weight: 400 !important;
      }

      :host::ng-deep span.p-button-icon {
        padding-top: 2px;
      }

      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-adminkey,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-github,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-rules,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-published,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-createweekly,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-publishweekly,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-addweeklymap,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-addplayer,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-addmap,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-featuretoggles,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-home {
        display: none;
      }

      @media (max-width: 780px) {
        .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-standings,
        .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-stats,
        .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-weekly,
        .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-weeklyleague {
          display: none;
        }
      }

      @media (min-width: 780px) {
        :host::ng-deep .layout-topbar-menu-menuitem .layout-topbar-menu-menuitem-standings,
        :host::ng-deep .layout-topbar-menu-menuitem .layout-topbar-menu-menuitem-stats,
        :host::ng-deep .layout-topbar-menu-menuitem .layout-topbar-menu-menuitem-weekly,
        :host::ng-deep .layout-topbar-menu-menuitem .layout-topbar-menu-menuitem-weeklyleague,
        :host::ng-deep .layout-topbar-menu-menuitem [role='separator'] {
          display: none;
        }
      }

      @media (max-width: 512px) {
        .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-discord {
          display: none;
        }
      }

      @media (min-width: 512px) {
        :host::ng-deep .layout-topbar-menu-menuitem .layout-topbar-menu-menuitem-discord {
          display: none;
        }
      }
    `,
  ],
})
export class TopBarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title = 'Weekly League'
  @Input() showWeeklyLeagueMenuItems = true

  adminkeyVisible = false

  createWeeklyVisible = false
  createWeeklyDate = new Date().toISOString().split('T')[0]

  publishWeeklyVisible = false
  publishSelectedWeekly = ''

  addWeeklyMapVisible = false
  addWeeklyMapSelected: Map | undefined = undefined

  addPlayerVisible = false
  addPlayerAccountId = ''

  addMapVisible = false

  featureTogglesVisible = false
  featureToggles: FeatureToggleState[] = []

  showWeeklyLeagueMenuItemsSource = new BehaviorSubject<boolean>(this.showWeeklyLeagueMenuItems)
  showWeeklyLeagueMenuItems$ = this.showWeeklyLeagueMenuItemsSource.asObservable()

  destroy$ = new Subject<void>()

  noop = () => {
    /*noop*/
  }

  standingsItem: MenuItemExtended = {
    label: 'Standings',
    icon: 'pi pi-crown',
    routerLink: '/standings',
    visible: true,
    weeklyOnly: true,
    adminOnly: false,
    styleClass: 'layout-topbar-menu-menuitem-standings',
  }
  statsItem: MenuItemExtended = {
    label: 'Stats',
    icon: 'pi pi-chart-bar',
    routerLink: '/stats',
    visible: true,
    weeklyOnly: true,
    adminOnly: false,
    styleClass: 'layout-topbar-menu-menuitem-stats',
  }
  weeklyItem: MenuItemExtended = {
    label: 'Weekly',
    icon: 'pi pi-calendar',
    routerLink: '/weekly',
    visible: true,
    weeklyOnly: true,
    adminOnly: false,
    styleClass: 'layout-topbar-menu-menuitem-weekly',
  }
  separatorItem: MenuItemExtended = {
    separator: true,
    visible: false,
    weeklyOnly: true,
    adminOnly: false,
  }
  discordItem: MenuItemExtended = {
    label: 'Join',
    icon: 'pi pi-discord',
    command: () => window.open('https://join.holydynasty.events'),
    visible: true,
    weeklyOnly: false,
    adminOnly: false,
    styleClass: 'layout-topbar-menu-menuitem-discord',
  }
  rulesItem: MenuItemExtended = {
    label: 'Rules',
    icon: 'pi pi-book',
    routerLink: '/rules',
    visible: true,
    weeklyOnly: true,
    adminOnly: false,
    styleClass: 'layout-topbar-menu-menuitem-rules',
  }
  githubItem: MenuItemExtended = {
    label: 'Github',
    icon: 'pi pi-github',
    command: () => window.open('https://github.com/dwhitacre/tm-projects'),
    visible: true,
    weeklyOnly: false,
    adminOnly: false,
    styleClass: 'layout-topbar-menu-menuitem-github',
  }
  adminkeyItem: MenuItemExtended = {
    label: 'Enter Admin Key',
    icon: 'pi pi-lock',
    command: () => (this.adminkeyVisible = true),
    visible: true,
    weeklyOnly: false,
    adminOnly: false,
    styleClass: 'layout-topbar-menu-menuitem-adminkey',
  }
  togglePublishedItem: MenuItemExtended = {
    label: 'Toggle Published',
    icon: 'pi pi-pencil',
    command: () => {
      this.storeService.toggleLeaderboardPublished()
      this.storeService.fetchLeaderboard()
    },
    visible: true,
    weeklyOnly: true,
    adminOnly: true,
    styleClass: 'layout-topbar-menu-menuitem-published',
  }
  createWeeklyItem: MenuItemExtended = {
    label: 'Create Weekly',
    icon: 'pi pi-calendar-plus',
    command: () => (this.createWeeklyVisible = true),
    visible: true,
    weeklyOnly: true,
    adminOnly: true,
    styleClass: 'layout-topbar-menu-menuitem-createweekly',
  }
  publishWeeklyItem: MenuItemExtended = {
    label: 'Publish Weekly',
    icon: 'pi pi-cloud-upload',
    command: () => (this.publishWeeklyVisible = true),
    visible: true,
    weeklyOnly: true,
    adminOnly: true,
    styleClass: 'layout-topbar-menu-menuitem-publishweekly',
  }
  addWeeklyMapItem: MenuItemExtended = {
    label: 'Add Weekly Map',
    icon: 'pi pi-map',
    command: () => (this.addWeeklyMapVisible = true),
    visible: true,
    weeklyOnly: true,
    adminOnly: true,
    styleClass: 'layout-topbar-menu-menuitem-addweeklymap',
  }
  addPlayerItem: MenuItemExtended = {
    label: 'Add Player',
    icon: 'pi pi-user-plus',
    command: () => (this.addPlayerVisible = true),
    visible: true,
    weeklyOnly: true,
    adminOnly: true,
    styleClass: 'layout-topbar-menu-menuitem-addplayer',
  }
  addMapItem: MenuItemExtended = {
    label: 'Add Map',
    icon: 'pi pi-map',
    command: () => (this.addMapVisible = true),
    visible: true,
    weeklyOnly: true,
    adminOnly: true,
    styleClass: 'layout-topbar-menu-menuitem-addmap',
  }
  featureTogglesItem: MenuItemExtended = {
    label: 'Feature Toggles',
    icon: 'pi pi-code',
    command: () => (this.featureTogglesVisible = true),
    visible: true,
    weeklyOnly: false,
    adminOnly: true,
    styleClass: 'layout-topbar-menu-menuitem-featuretoggles',
  }
  weeklyLeagueItem: MenuItemExtended = {
    label: 'Weekly League',
    icon: 'pi pi-calendar',
    routerLink: '/weeklyleague',
    visible: true,
    weeklyOnly: false,
    adminOnly: false,
    homeOnly: true,
    styleClass: 'layout-topbar-menu-menuitem-weeklyleague',
  }
  homeItem: MenuItemExtended = {
    label: 'Home',
    icon: 'pi pi-home',
    routerLink: '/',
    visible: isEnabled(FeatureToggle.homepage),
    weeklyOnly: true,
    adminOnly: false,
    styleClass: 'layout-topbar-menu-menuitem-home',
  }

  #menuItems: MenuItemExtended[] = [
    this.weeklyLeagueItem,
    this.standingsItem,
    this.statsItem,
    this.weeklyItem,
    this.separatorItem,
    this.discordItem,
    this.rulesItem,
    this.githubItem,
    this.homeItem,
    this.adminkeyItem,
    this.togglePublishedItem,
    this.createWeeklyItem,
    this.publishWeeklyItem,
    this.addWeeklyMapItem,
    this.addPlayerItem,
    this.addMapItem,
    this.featureTogglesItem,
  ]

  menuItems$ = combineLatest([this.storeService.isAdmin$, this.showWeeklyLeagueMenuItems$]).pipe(
    map(([isAdmin, showWeeklyLeagueMenuItems]) => {
      return this.#menuItems.filter((item) => {
        if (item.weeklyOnly && !showWeeklyLeagueMenuItems) {
          return false
        }
        if (item.adminOnly && !isAdmin) {
          return false
        }
        if (item.homeOnly && showWeeklyLeagueMenuItems) {
          return false
        }
        return true
      })
    }),
  )

  constructor(public storeService: StoreService) {}

  createWeekly(value: string) {
    this.storeService.createWeekly(value)
    this.createWeeklyVisible = false
  }

  publishWeekly(value: string) {
    this.storeService.publishWeekly(value)
    this.publishWeeklyVisible = false
  }

  addWeeklyMap(weeklyId: string, value: string) {
    this.storeService.addWeeklyMap([weeklyId, value])
    this.addWeeklyMapVisible = false
  }

  addPlayer(value: string) {
    this.storeService.addPlayer(value)
    this.addPlayerVisible = false
  }

  addMap(value: string) {
    this.storeService.addMap(value)
    this.addMapVisible = false
  }

  ngOnInit() {
    this.storeService.featureToggles$.pipe(takeUntil(this.destroy$)).subscribe((featureToggles) => {
      this.featureToggles = featureToggles
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showWeeklyLeagueMenuItems']) {
      this.showWeeklyLeagueMenuItemsSource.next(changes['showWeeklyLeagueMenuItems'].currentValue)
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
