import { Component, EventEmitter, Input, Output } from '@angular/core'
import { StoreService } from 'src/services/store.service'

@Component({
  selector: 'admin-key-dialog',
  standalone: false,
  template: `
    <p-dialog
      header="Enter Admin Key"
      [modal]="true"
      [(visible)]="visible"
      position="topright"
      [draggable]="false"
      [style]="{ width: '25rem' }"
      (onHide)="visibleChange.emit(false)"
    >
      <div class="dialog-input">
        <input pInputText #adminkey type="password" autocomplete="off" />
      </div>
      <div class="dialog-actions">
        <p-button label="Cancel" severity="secondary" (click)="visibleChange.emit(false)" />
        <p-button label="Enter" (click)="storeService.updateAdmin(adminkey.value); visibleChange.emit(false)" />
      </div>
    </p-dialog>
  `,
  styles: [
    `
      .dialog-input {
        display: flex;
        align-items: center;
        gap: 3rem;
        margin-bottom: 1rem;
      }

      .dialog-input input {
        width: 100%;
      }

      .dialog-actions {
        display: flex;
        justify-content: end;
        gap: 12px;
      }
    `,
  ],
})
export class AdminKeyDialogComponent {
  @Input() visible: boolean = false
  @Output() visibleChange = new EventEmitter<boolean>()

  constructor(public storeService: StoreService) {}
}
