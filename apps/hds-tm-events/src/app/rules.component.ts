import { Component, NgModule } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { CommonModule } from '@angular/common'
import { FieldsetModule } from 'primeng/fieldset'

@Component({
  selector: 'rules',
  template: `
    <layout>
      <p-fieldset legend="Simplified Rules" [toggleable]="true">
        <p>
          Open to anyone, Regular start time is Saturdays at 4pm Eastern, Qualifier is 15 rounds, Top 8 from qualifier
          advance to 1v1 single elim bracket
        </p>
        <p>Quarterfinals is best of 3, Semifinals best of 5, Finals best of 7. 5 round wins takes the map</p>
      </p-fieldset>
      <p-fieldset legend="Event Overview" [toggleable]="true">
        <p>This weekly event is open to anyone who wishes to participate</p>
        <p>The competition will begin at 4pm EST with the qualifier match each week unless otherwise announced</p>
        <p>
          The Map Pool is chosen by HD, these maps are a variety of previous TOTDs, Campaign Maps, or any other map HD
          chooses
        </p>
        <p>The Map Pool will consist of 8 maps each week and can be found in the Kentucky Trackmania Club in game.</p>
        <p>
          Two maps will rotate each week, the two rotating out will be the 01 and 02 maps in the campaign and will also
          be highlighted in that weeks sheet
        </p>
        <p>
          Maps can be suggested by the players anytime in the weekly league map suggestion channel in the Kentucky
          Trackmania Discord
        </p>
      </p-fieldset>
      <p-fieldset legend="How to Register/Play" [toggleable]="true">
        <p>
          Simple, show up to the qualifier. Qualifier room will be up 10 minutes before Qualifier goes live promptly at
          4pm EST
        </p>
        <p>Qualifier and all Match Rooms will be in the Kentucky Trackmania Club</p>
      </p-fieldset>
      <p-fieldset legend="Qualification" [toggleable]="true">
        <p>Each week's event will start with a qualifier match</p>
        <p>Five maps from the map pool will randomly be chosen on stream and put into a room</p>
        <p>All players for that week will play 3 rounds on each map totaling 15 rounds played</p>
        <p>The Top 8 players at the end of the 15 rounds will advance and be placed into the main bracket</p>
        <p>
          If there is a tie among the top 8 players that doesnt decide if a player makes the cut, the tiebreaker will be
          whoever has the most league points.
        </p>
        <p>If there is still a tie after checking league points earned: tiebreaker will be alphabetical A -> Z</p>
        <p>
          If there is a tie that would effect who would make it into main bracket: The Qualifier room will be reset to
          the first map played and the tied players will play a 1 round sudden death
        </p>
        <p>
          Example 1: If four players are tied for 7th, the four tied players will play a one round sudden death. The top
          2 finishers will advance to fill the 7th and 8th seed
        </p>
        <p>
          Example 2: If 3 players are tied for 8th, the three tied players will play a one round sudden death. The
          winner will advance and fill the 8th seed.
        </p>
      </p-fieldset>
      <p-fieldset legend="Main Bracket" [toggleable]="true">
        <p>
          The Quarterfinals will be best of 3 maps, Semifinals will be best of 5 maps, Finals will be best of 7 maps
        </p>
        <p>Maps for each match will be selected by a draft</p>
        <p>
          For each match a thread will be made in the events general channel of the discord, the players in that match
          will be pinged and draft their maps
        </p>
        <p>
          The player with the better seed will begin the draft picking the first map, the players will alternate picks
        </p>
        <p>
          *QUARTERFINALS ONLY* Before draft begins each player will ban one map from the pool, Due to being reduced to a
          best of 3 for time.
        </p>
        <p>
          *QUARTERFINALS ONLY* The player with the better seed will ban first, then opponent. After bans the draft will
          proceed as normal
        </p>
        <p>
          In the quarterfinals each player will choose 1 map, semis each player will choose 2 maps, and finals each
          player will choose 3 maps
        </p>
        <p>The final map in each match will be chosen by HD</p>
        <p>Each map will be played first to 5 round wins</p>
        <p>The player who reaches 5 round wins first, wins the map</p>
      </p-fieldset>
      <p-fieldset legend="Prize Pool" [toggleable]="true">
        <p>There will be a $100 prize pool (minimum) each week</p>
        <p>First place will win $70</p>
        <p>Second place will win $30</p>
      </p-fieldset>
      <p-fieldset legend="League Points" [toggleable]="true">
        <p>Points will be awarded each week</p>
        <p>Players will accumlate points throughtout the year</p>
        <p>
          The top 8 players with the most league points at the end of the year will be invited to a special event with a
          $1,000 prize pool
        </p>
        <p>
          This event is projected to be the first or second weekend of December, exact date and details will be released
          at a later time
        </p>
      </p-fieldset>
      <p-fieldset legend="Rules / Technical Issues" [toggleable]="true">
        <p>
          In case of a player disconnection or any other technical issue that prevents a player from playing in a main
          bracket match, they are entitled to a technical pause. If the technical issue occurs mid-round, then the round
          when the event occurred is still counted towards the match. During a technical pause, players are not allowed
          to drive until one of the following conditions apply:
        </p>
        <p>(a) the technical problem has been resolved (player reconnected, fixed input device, etc.);</p>
        <p>(b) 5 minutes have passed since the occurrence of the technical problem.</p>
        <p></p>
        <p>Friendly trash-talk is permitted so long as all players involved are okay with it.</p>
        <p>Toxicity in match or on the league's discord channel are strictly forbidden.</p>
        <p>Continued toxicity will result in a ban from the league.</p>
      </p-fieldset>
      <p-fieldset legend="Disclaimer" [toggleable]="true">
        <p>The organizer and admins reserve the right to change these rules at any time.</p>
        <p>Any changes made to the rules will be announced in the HDs Announcements Channel in the discord</p>
      </p-fieldset>
    </layout>
  `,
  styles: [
    `
      p {
        text-align: center;
      }

      :host ::ng-deep .p-fieldset-legend a {
        color: #fbbf24;
      }
    `,
  ],
})
export class RulesComponent {}

@NgModule({
  exports: [RulesComponent],
  declarations: [RulesComponent],
  imports: [CommonModule, ComponentsModule, FieldsetModule],
})
export class RulesModule {}
