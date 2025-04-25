import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-submit-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div style="text-align: center; padding: 20px;">
      <h2>Quiz Submitted!</h2>
      <p>Your answers have been successfully submitted.</p>
      <button mat-raised-button color="primary" (click)="close()">OK</button>
    </div>
  `,
})
export class SubmitConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SubmitConfirmationDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
