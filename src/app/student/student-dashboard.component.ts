import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';
import { ResultModalComponent } from './result-modal.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
  ],
  template: `
    <div class="dashboard-container">
      <mat-tab-group>
        <!-- Active Quizzes Tab -->
        <mat-tab label="Active">
          <div class="quiz-grid">
            <mat-card *ngFor="let quiz of activeQuizzes" class="quiz-card">
              <mat-card-title>{{ quiz.title }}</mat-card-title>
              <mat-card-subtitle
                >Time Limit: {{ quiz.timer }} min</mat-card-subtitle
              >
              <button
                mat-raised-button
                color="primary"
                (click)="startQuiz(quiz.id)"
              >
                Start
              </button>
            </mat-card>
          </div>
        </mat-tab>
        <!-- Completed Quizzes Tab -->
        <mat-tab label="Completed">
          <div
            *ngIf="completedQuizzes.length > 0; else noResults"
            class="quiz-grid"
          >
            <mat-card *ngFor="let result of completedQuizzes" class="quiz-card">
              <mat-card-title>{{ result.quizTitle }}</mat-card-title>
              <mat-card-subtitle>
                Score: {{ result.score }}/{{ result.total }} <br />
                Submitted: {{ result.submittedAt | date : 'short' }}
              </mat-card-subtitle>
              <button
                mat-raised-button
                color="accent"
                (click)="openResult(result)"
              >
                View Result
              </button>
            </mat-card>
          </div>
          <ng-template #noResults>
            <p>No completed quizzes yet.</p>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 24px;
      }
      .quiz-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-top: 16px;
      }
      .quiz-card {
        width: 300px;
      }
    `,
  ],
})
export class StudentDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private userService = inject(UserService);
  activeQuizzes: any[] = [];
  completedQuizzes: any[] = [];
  ngOnInit() {
    const userId = this.userService.getUserId();
    if (userId) {
      this.fetchActiveQuizzes(userId);
      this.fetchCompletedQuizzes(userId);
    }
  }

  fetchActiveQuizzes(userId: string) {
    // const userId = localStorage.getItem('userId');
    this.http
      .get<any[]>('http://localhost:3000/results?userId=' + userId)
      .subscribe((results) => {
        const attemptedQuizIds = results.map((r) => r.quizId);

        this.http
          .get<any[]>('http://localhost:3000/quizzes')
          .subscribe((quizzes) => {
            this.activeQuizzes = quizzes.filter(
              (q) => !attemptedQuizIds.includes(q.id)
            );
          });
      });
  }

  fetchCompletedQuizzes(userId: string) {
    // const userId = localStorage.getItem('userId');
    this.http
      .get<any[]>(`http://localhost:3000/results?userId=${userId}`)
      .subscribe((results) => {
        if (!results || results.length === 0) return;

        const quizFetches = results.map((result) =>
          this.http
            .get<any>(`http://localhost:3000/quizzes/${result.quizId}`)
            .toPromise()
        );

        Promise.all(quizFetches).then((quizzes) => {
          this.completedQuizzes = results.map((res, i) => ({
            ...res,
            quizTitle: quizzes[i]?.title ?? 'Untitled Quiz',
            total: quizzes[i]?.questions.length ?? 0,
            submittedAt: res.submittedAt || new Date().toISOString(),
          }));
        });
      });
  }

  startQuiz(quizId: string | number) {
    // First, set the quiz status to "In Progress" when the student starts
    this.http
      .get<any[]>('http://localhost:3000/quizzes')
      .subscribe((quizzes) => {
        const quizToUpdate = quizzes.find((q) => q.id === quizId);
        if (quizToUpdate) {
          quizToUpdate.status = 'In Progress'; // Update the status to "In Progress"

          this.http
            .put(`http://localhost:3000/quizzes/${quizId}`, quizToUpdate)
            .subscribe(() => {
              console.log('Quiz status updated to In Progress');
              this.router.navigate(['/student/quiz', quizId]); // Navigate to the quiz
            });
        }
      });
  }

  openResult(result: any) {
    this.dialog.open(ResultModalComponent, {
      width: '600px',
      data: result,
    });
  }
}
