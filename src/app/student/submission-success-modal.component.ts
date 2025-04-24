// submission-success-modal.component.ts
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-submission-success-modal',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Submission Successful</h2>
    <mat-dialog-content>
      <p>Your quiz has been submitted successfully!</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>OK</button>
    </mat-dialog-actions>
  `,
})
export class SubmissionSuccessModalComponent {}
// This component is a simple modal that informs the user that their quiz submission was successful. It uses Angular Material's dialog module for the modal functionality.
