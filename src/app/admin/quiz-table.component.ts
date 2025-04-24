import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-quiz-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatDialogModule, MatButtonModule],
  template: `
    <h2>All Quizzes</h2>
    <table mat-table [dataSource]="quizzes" class="mat-elevation-z8">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Quiz Title</th>
        <td mat-cell *matCellDef="let quiz">{{ quiz.title }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let quiz">
          <button
            mat-raised-button
            color="primary"
            (click)="openResultsDialog(quiz)"
          >
            View Result
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let quiz; columns: displayedColumns"></tr>
    </table>
  `,
})
export class QuizTableComponent implements OnInit {
  quizzes: any[] = [];
  displayedColumns: string[] = ['title', 'actions'];

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/quizzes').subscribe((data) => {
      this.quizzes = data;
    });
  }

  openResultsDialog(quiz: any) {
    this.dialog.open(QuizResultsDialogComponent, {
      data: {
        quizId: quiz.id,
        quizTitle: quiz.title,
      },
    });
  }
}

@Component({
  selector: 'app-quiz-results-dialog',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Results for "{{ data.quizTitle }}"</h2>
    <mat-dialog-content>
      <div *ngIf="loading">Loading results...</div>

      <table
        mat-table
        [dataSource]="results"
        class="mat-elevation-z1"
        *ngIf="!loading"
      >
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Student Name</th>
          <td mat-cell *matCellDef="let result">{{ result.studentName }}</td>
        </ng-container>

        <ng-container matColumnDef="score">
          <th mat-header-cell *matHeaderCellDef>Score</th>
          <td mat-cell *matCellDef="let result">{{ result.score }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="['name', 'score']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['name', 'score']"></tr>
      </table>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Close</button>
    </mat-dialog-actions>
  `,
})
export class QuizResultsDialogComponent implements OnInit {
  results: any[] = [];
  loading = true;
  private http = inject(HttpClient);

  constructor(
    public dialogRef: MatDialogRef<QuizResultsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { quizId: number; quizTitle: string }
  ) {}

  ngOnInit(): void {
    this.http
      .get<any[]>(`http://localhost:3000/results?quizId=${this.data.quizId}`)
      .subscribe({
        next: (res) => {
          this.results = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching results:', err);
          this.loading = false;
        },
      });
  }
}
