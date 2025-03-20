import { Component } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { map } from 'rxjs'
import { StoreService } from 'src/services/store.service'
import { Map } from 'src/domain/map'

@Component({
  selector: 'topbar',
  template: `
    <div class="layout-topbar">
      <a class="layout-topbar-logo">
        <img src="assets/images/hds-events-nobg.png" alt="logo" height="32" />
        <span class="layout-topbar-title">HD Weekly League</span>
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
                <span>{{ map.name | tm : 'humanize' }}</span>
              </ng-template>
              <ng-template let-map pTemplate="item">
                <span>{{ map.name | tm : 'humanize' }}</span>
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
        box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
        border-bottom: 1px solid var(--surface-border);
        background-color: var(--surface-card);
      }

      .layout-topbar .layout-topbar-logo {
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 500;
        width: 250px;
        border-radius: 12px;
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

      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-adminkey,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-github,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-rules,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-published,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-createweekly,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-publishweekly,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-addweeklymap,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-addplayer,
      .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-addmap {
        display: none;
      }

      @media (max-width: 780px) {
        .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-standings,
        .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-stats,
        .layout-topbar-menu-standalone.layout-topbar-menu-menuitem-weekly {
          display: none;
        }
      }

      @media (min-width: 780px) {
        :host::ng-deep .layout-topbar-menu-menuitem .layout-topbar-menu-menuitem-standings,
        :host::ng-deep .layout-topbar-menu-menuitem .layout-topbar-menu-menuitem-stats,
        :host::ng-deep .layout-topbar-menu-menuitem .layout-topbar-menu-menuitem-weekly,
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
export class TopBarComponent {
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

  noop = () => {
    /*noop*/
  }

  standingsItem: MenuItem = {
    label: 'Standings',
    icon: 'pi pi-crown',
    routerLink: '/standings',
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-standings',
  }
  statsItem: MenuItem = {
    label: 'Stats',
    icon: 'pi pi-chart-bar',
    routerLink: '/stats',
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-stats',
  }
  weeklyItem: MenuItem = {
    label: 'Weekly',
    icon: 'pi pi-calendar',
    routerLink: '/weekly',
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-weekly',
  }
  discordItem: MenuItem = {
    label: 'Join',
    icon: 'pi pi-discord',
    command: () => window.open('https://join.hdweeklyleague.com'),
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-discord',
  }
  rulesItem: MenuItem = {
    label: 'Rules',
    icon: 'pi pi-book',
    routerLink: '/rules',
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-rules',
  }
  githubItem: MenuItem = {
    label: 'Github',
    icon: 'pi pi-github',
    command: () => window.open('https://github.com/dwhitacre/hds-tm-events'),
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-github',
  }
  adminkeyItem: MenuItem = {
    label: 'Enter Admin Key',
    icon: 'pi pi-lock',
    command: () => (this.adminkeyVisible = true),
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-adminkey',
  }
  togglePublishedItem: MenuItem = {
    label: 'Toggle Published',
    icon: 'pi pi-pencil',
    command: () => {
      this.storeService.toggleLeaderboardPublished()
      this.storeService.fetchLeaderboard()
    },
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-published',
  }
  createWeeklyItem: MenuItem = {
    label: 'Create Weekly',
    icon: 'pi pi-calendar-plus',
    command: () => (this.createWeeklyVisible = true),
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-createweekly',
  }
  publishWeeklyItem: MenuItem = {
    label: 'Publish Weekly',
    icon: 'pi pi-cloud-upload',
    command: () => (this.publishWeeklyVisible = true),
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-publishweekly',
  }
  addWeeklyMapItem: MenuItem = {
    label: 'Add Weekly Map',
    icon: 'pi pi-map',
    command: () => (this.addWeeklyMapVisible = true),
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-addweeklymap',
  }
  addPlayerItem: MenuItem = {
    label: 'Add Player',
    icon: 'pi pi-user-plus',
    command: () => (this.addPlayerVisible = true),
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-addplayer',
  }
  addMapItem: MenuItem = {
    label: 'Add Map',
    icon: 'pi pi-map',
    command: () => (this.addMapVisible = true),
    visible: true,
    styleClass: 'layout-topbar-menu-menuitem-addmap',
  }

  menuItems$ = this.storeService.isAdmin$.pipe(
    map((isAdmin) => {
      const adminMenuItems = isAdmin
        ? [
            this.togglePublishedItem,
            this.createWeeklyItem,
            this.publishWeeklyItem,
            this.addWeeklyMapItem,
            this.addPlayerItem,
            this.addMapItem,
          ]
        : []

      return [
        this.standingsItem,
        this.statsItem,
        this.weeklyItem,
        { separator: true },
        this.discordItem,
        this.rulesItem,
        this.githubItem,
        this.adminkeyItem,
        ...adminMenuItems,
      ]
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
}
