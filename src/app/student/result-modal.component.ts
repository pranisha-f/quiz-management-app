import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-result-modal',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="result-card">
      <h2>Result Summary</h2>
      <p><strong>Quiz:</strong> {{ data.quizTitle }}</p>
      <p><strong>Score:</strong> {{ data.score }} / {{ data.total }}</p>
      <p>
        <strong>Submitted At:</strong> {{ data.submittedAt | date : 'medium' }}
      </p>

      <div class="actions">
        <button mat-button (click)="dialogRef.close()">Close</button>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .result-card {
        max-width: 500px;
        padding: 24px;
      }
      .actions {
        text-align: right;
        margin-top: 20px;
      }
    `,
  ],
})
export class ResultModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ResultModalComponent>
  ) {}
}
