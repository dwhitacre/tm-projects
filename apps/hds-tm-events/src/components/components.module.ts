import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { LayoutComponent } from './layout.component'
import { TopBarComponent } from './topbar.component'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TableModule } from 'primeng/table'
import { PositionPipe } from 'src/pipes/position.pipe'
import { MenuModule } from 'primeng/menu'
import { DialogModule } from 'primeng/dialog'
import { InputTextModule } from 'primeng/inputtext'
import { CommonModule } from '@angular/common'
import { TopsTableComponent } from './tops-table.component'
import { TopsGridComponent } from './tops-grid.component'
import { TopCardComponent } from './top-card.component'
import { MessagesModule } from 'primeng/messages'
import { InputMaskModule } from 'primeng/inputmask'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { InplaceModule } from 'primeng/inplace'
import { TopCardPlayerComponent } from './top-card-player.component'
import { ContextMenuModule } from 'primeng/contextmenu'
import { InputNumberModule } from 'primeng/inputnumber'
import { StatsTableComponent } from './stats-table.component'
import { MatchBracketComponent } from './match-bracket.component'
import { TmPipe } from 'src/pipes/tm.pipe'
import { SafeHtmlPipe } from 'src/pipes/safe-html.pipe'
import { CheckboxModule } from 'primeng/checkbox'
import { TeamPanelComponent } from './team-panel.component'
import { PanelModule } from 'primeng/panel'
import { PlayersListComponent } from './players-list.component'
import { PostPanelComponent } from './post-panel.component'
import { PlayerInfoComponent } from './player-info.component'
import { EventPanelComponent } from './event-panel.component'
import { NoTeamsPanelComponent } from './no-teams-panel.component'
import { NoPostsPanelComponent } from './no-posts-panel.component'
import { NoEventsPanelComponent } from './no-events-panel.component'
import { TagModule } from 'primeng/tag'
import { AdminKeyDialogComponent } from './admin-key-dialog.component'
import { TeamDialogComponent } from './team-dialog.component'
import { NewTeamButtonComponent } from './new-team-button.component'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToggleSwitchModule } from 'primeng/toggleswitch'
import { EventDialogComponent } from './event-dialog.component'
import { NewEventButtonComponent } from './new-event-button.component'
import { DatePickerModule } from 'primeng/datepicker'
import { PostDialogComponent } from './post-dialog.component'
import { NewPostButtonComponent } from './new-post-button.component'
import { TextareaModule } from 'primeng/textarea'
import { MultiSelectModule } from 'primeng/multiselect'

@NgModule({
  declarations: [
    LayoutComponent,
    TopBarComponent,
    TopsTableComponent,
    TopsGridComponent,
    TopCardComponent,
    TopCardPlayerComponent,
    StatsTableComponent,
    MatchBracketComponent,
    TeamPanelComponent,
    PlayersListComponent,
    PostPanelComponent,
    PlayerInfoComponent,
    EventPanelComponent,
    NoTeamsPanelComponent,
    NoPostsPanelComponent,
    NoEventsPanelComponent,
    AdminKeyDialogComponent,
    TeamDialogComponent,
    NewTeamButtonComponent,
    EventDialogComponent,
    NewEventButtonComponent,
    PostDialogComponent,
    NewPostButtonComponent,
  ],
  exports: [
    LayoutComponent,
    TopBarComponent,
    ProgressSpinnerModule,
    TopsTableComponent,
    TopsGridComponent,
    TopCardComponent,
    StatsTableComponent,
    MatchBracketComponent,
    TeamPanelComponent,
    PlayersListComponent,
    PostPanelComponent,
    PlayerInfoComponent,
    EventPanelComponent,
    NoTeamsPanelComponent,
    NoPostsPanelComponent,
    NoEventsPanelComponent,
    TagModule,
    TeamDialogComponent,
    NewTeamButtonComponent,
    ContextMenuModule,
    ConfirmDialogModule,
    ToggleSwitchModule,
    EventDialogComponent,
    NewEventButtonComponent,
    DatePickerModule,
    PostDialogComponent,
    TextareaModule,
    MultiSelectModule,
    NewPostButtonComponent,
  ],
  imports: [
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    TableModule,
    PositionPipe,
    MenuModule,
    DialogModule,
    InputTextModule,
    CommonModule,
    MessagesModule,
    InputMaskModule,
    FormsModule,
    DropdownModule,
    InplaceModule,
    ContextMenuModule,
    InputNumberModule,
    TmPipe,
    SafeHtmlPipe,
    RouterModule,
    CheckboxModule,
    PanelModule,
    TagModule,
    ConfirmDialogModule,
    ToggleSwitchModule,
    DatePickerModule,
    TextareaModule,
    MultiSelectModule,
  ],
})
export class ComponentsModule {}
