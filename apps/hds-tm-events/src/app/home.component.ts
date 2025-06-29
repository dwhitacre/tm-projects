import { Component } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { CommonModule } from '@angular/common'
import { StoreService } from 'src/services/store.service'
import { PanelModule } from 'primeng/panel'
import { Team } from 'src/domain/team'
import { ConfirmationService } from 'primeng/api'
import { Event } from 'src/domain/event'
import { Post } from 'src/domain/post'
import { map, Observable, tap } from 'rxjs'

@Component({
  selector: 'home',
  template: `
    <layout [title]="'Holy Dynasty'" [showWeeklyLeagueMenuItems]="false">
      <div class="container">
        <div class="column teams">
          <ng-container *ngIf="storeService.teams$ | async as teams">
            <ng-container *ngIf="teams.length > 0; else noTeams">
              <div *ngFor="let team of teams" class="team-group">
                <team-panel
                  [showContextMenu]="(storeService.isAdmin$ | async) ?? false"
                  [team]="team"
                  (edit)="showTeamDialog(team, true)"
                  (delete)="showTeamDeleteDialog(team)"
                ></team-panel>
              </div>
            </ng-container>
          </ng-container>
          <ng-template #noTeams>
            <no-teams-panel></no-teams-panel>
          </ng-template>
          <ng-container *ngIf="storeService.isAdmin$ | async">
            <new-team-button (click)="showTeamDialog()"></new-team-button>
          </ng-container>
        </div>
        <div class="column posts">
          <ng-container *ngIf="storeService.posts$ | async as posts">
            <ng-container *ngIf="posts.length > 0; else noPosts">
              <div *ngFor="let post of posts">
                <post-panel
                  [post]="post"
                  [showContextMenu]="(storeService.isAdmin$ | async) ?? false"
                  (edit)="showPostDialog(post, true)"
                  (delete)="showPostDeleteDialog(post)"
                ></post-panel>
              </div>
            </ng-container>
          </ng-container>
          <ng-template #noPosts>
            <no-posts-panel></no-posts-panel>
          </ng-template>
          <ng-container *ngIf="storeService.isAdmin$ | async">
            <new-post-button (click)="showPostDialog()"></new-post-button>
          </ng-container>
        </div>
        <div class="column events">
          <ng-container *ngIf="storeService.events$ | async as events">
            <ng-container *ngIf="events.length > 0; else noEvents">
              <div *ngFor="let event of events" class="event-card">
                <event-panel
                  [showContextMenu]="(storeService.isAdmin$ | async) ?? false"
                  [event]="event"
                  [eventEmbed]="getEventEmbed$(event) | async"
                  (edit)="showEventDialog(event, true)"
                  (delete)="showEventDeleteDialog(event)"
                  (embedDelete)="showEventEmbedDeleteDialog(event)"
                ></event-panel>
              </div>
            </ng-container>
          </ng-container>
          <ng-template #noEvents>
            <no-events-panel></no-events-panel>
          </ng-template>
          <ng-container *ngIf="storeService.isAdmin$ | async">
            <new-event-button (click)="showEventDialog()"></new-event-button>
          </ng-container>
        </div>
      </div>
    </layout>

    <p-confirmdialog />

    <team-dialog
      [team]="selectedTeam"
      [editMode]="selectedTeamEditMode"
      [teamRoles]="(storeService.teamRoles$ | async) ?? []"
      [players]="(storeService.players$ | async) ?? []"
      [(visible)]="teamDialogVisible"
      (save)="saveTeam($event)"
    ></team-dialog>

    <event-dialog
      [event]="selectedEvent"
      [editMode]="selectedEventEditMode"
      [teamRoles]="(storeService.teamRoles$ | async) ?? []"
      [players]="(storeService.teamPlayers$ | async) ?? []"
      [(visible)]="eventDialogVisible"
      (save)="saveEvent($event)"
    ></event-dialog>

    <post-dialog
      [post]="selectedPost"
      [editMode]="selectedPostEditMode"
      [tags]="(storeService.tags$ | async) ?? []"
      [players]="(storeService.teamPlayers$ | async) ?? []"
      [(visible)]="postDialogVisible"
      (save)="savePost($event)"
    ></post-dialog>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: row;
        gap: 16px;
        color: #ffffff;
        justify-content: center;
      }
      .column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 280px;
      }

      .teams {
        flex-grow: 1;
        flex-shrink: 1;
        max-width: 300px;
      }

      .posts {
        flex-grow: 3;
        flex-shrink: 3;
        max-width: 900px;
        min-width: 450px;
      }

      .events {
        flex-grow: 1;
        flex-shrink: 1;
        max-width: 325px;
      }

      @media (max-width: 576px) {
      }

      @media (min-width: 577px) and (max-width: 768px) {
      }

      @media (min-width: 769px) and (max-width: 992px) {
      }
    `,
  ],
  imports: [CommonModule, ComponentsModule, PanelModule],
  standalone: true,
})
export class HomeComponent {
  teamDialogVisible: boolean = false
  selectedTeam: Team | undefined
  selectedTeamEditMode: boolean = false
  eventDialogVisible: boolean = false
  selectedEvent: Event | undefined
  selectedEventEditMode: boolean = false
  postDialogVisible: boolean = false
  selectedPost: Post | undefined
  selectedPostEditMode: boolean = false

  private eventEmbedObservables: { [eventId: number]: Observable<Blob | null> } = {}

  constructor(
    public storeService: StoreService,
    private confirmationService: ConfirmationService,
  ) {}

  getEventEmbed$(event: Event) {
    if (!this.eventEmbedObservables[event.eventId]) {
      this.eventEmbedObservables[event.eventId] = this.storeService.eventEmbeds$.pipe(
        map((embeds) => embeds[event.eventId] ?? null),
      )
    }
    return this.eventEmbedObservables[event.eventId]
  }

  showTeamDialog(team?: Team, editMode: boolean = false) {
    this.selectedTeam =
      team ??
      ({
        teamId: 0,
        name: '',
        description: '',
        sortOrder: 0,
        isVisible: true,
        organizationId: 0,
        players: [],
      } as Team)
    this.selectedTeamEditMode = editMode
    this.teamDialogVisible = true
  }

  showTeamDeleteDialog(team: Team) {
    this.confirmationService.confirm({
      message: `Do you want to delete the team: ${team.name}?`,
      header: 'Delete Team',
      icon: 'pi pi-users',
      closeOnEscape: true,
      closable: true,
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
      },
      acceptButtonProps: {
        label: 'Delete',
      },
      accept: () => {
        this.storeService.deleteTeam(team)
      },
    })
  }

  saveTeam(team: Team) {
    this.storeService.upsertTeam(team)
    this.teamDialogVisible = false
  }

  showEventDialog(event?: Event, editMode: boolean = false) {
    this.selectedEvent =
      event ??
      ({
        eventId: 0,
        name: '',
        description: '',
        dateStart: new Date().toISOString(),
        dateEnd: new Date().toISOString(),
        isVisible: true,
        image: '',
        externalUrl: '',
        sortOrder: 0,
        organizationId: 0,
        players: [],
      } as Event)
    this.selectedEventEditMode = editMode
    this.eventDialogVisible = true
  }

  showEventDeleteDialog(event: Event) {
    this.confirmationService.confirm({
      message: `Do you want to delete the event: ${event.name}?`,
      header: 'Delete Event',
      icon: 'pi pi-calendar',
      closeOnEscape: true,
      closable: true,
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
      },
      acceptButtonProps: {
        label: 'Delete',
      },
      accept: () => {
        this.storeService.deleteEvent(event)
      },
    })
  }

  showEventEmbedDeleteDialog(event: Event) {
    this.confirmationService.confirm({
      message: `Do you want to delete the embed for the event: ${event.name}?`,
      header: 'Delete Event Embed',
      icon: 'pi pi-calendar',
      closeOnEscape: true,
      closable: true,
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
      },
      acceptButtonProps: {
        label: 'Delete',
      },
      accept: () => {
        this.storeService.deleteEventEmbed(event.eventId)
      },
    })
  }

  saveEvent(event: Event) {
    this.storeService.upsertEvent(event)
    this.eventDialogVisible = false
  }

  showPostDialog(post?: Post, editMode: boolean = false) {
    this.selectedPost =
      post ??
      ({
        postId: 0,
        accountId: '',
        title: '',
        description: '',
        image: '',
        content: '',
        sortOrder: 0,
        isVisible: true,
        organizationId: 0,
        author: undefined,
        tags: [],
      } as Post)
    this.selectedPostEditMode = editMode
    this.postDialogVisible = true
  }

  showPostDeleteDialog(post: Post) {
    this.confirmationService.confirm({
      message: `Do you want to delete the post: ${post.title}?`,
      header: 'Delete Post',
      icon: 'pi pi-file',
      closeOnEscape: true,
      closable: true,
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
      },
      acceptButtonProps: {
        label: 'Delete',
      },
      accept: () => {
        this.storeService.deletePost(post)
      },
    })
  }

  savePost(post: Post) {
    this.storeService.upsertPost(post)
    this.postDialogVisible = false
  }
}
