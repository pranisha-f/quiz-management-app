import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { SubmitConfirmationDialogComponent } from './submit-confirmation-dialgoue.component';

@Component({
  selector: 'app-student-quiz',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
  ],
  template: `
    <div *ngIf="quizForm && quiz">
      <h2>{{ quiz.title }}</h2>
      <form [formGroup]="quizForm" (ngSubmit)="submitAnswers()">
        <div
          formArrayName="answers"
          *ngFor="let question of quiz.questions; let i = index"
        >
          <div [formGroupName]="i" class="mb-4">
            <mat-card>
              <p>
                <strong>Q{{ i + 1 }}:</strong> {{ question.text }}
              </p>
              <mat-radio-group formControlName="response">
                <mat-radio-button value="Yes">Yes</mat-radio-button>
                <mat-radio-button value="No">No</mat-radio-button>
                <mat-radio-button value="Partial">Partial</mat-radio-button>
                <mat-radio-button value="N/A">N/A</mat-radio-button>
              </mat-radio-group>
            </mat-card>
          </div>
        </div>
        <button mat-raised-button color="primary" type="submit">
          Submit Quiz
        </button>
      </form>
    </div>
    <p *ngIf="!quiz">Loading quiz...</p>
  `,
  styles: [
    `
      mat-card {
        margin-bottom: 16px;
        padding: 16px;
      }
      mat-radio-group {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class StudentQuizComponent implements OnInit {
  quiz: any;
  quizForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog, // Inject MatDialog for dialog handling
    private userService: UserService
  ) {}

  ngOnInit() {
    const quizId = this.route.snapshot.paramMap.get('id');
    this.http
      .get(`http://localhost:3000/quizzes/${quizId}`)
      .subscribe((quizData: any) => {
        this.quiz = quizData;
        this.initForm();
      });
  }

  initForm() {
    const answersArray = this.quiz.questions.map(() =>
      this.fb.group({ response: ['', Validators.required] })
    );
    this.quizForm = this.fb.group({
      answers: this.fb.array(answersArray),
    });
  }

  submitAnswers() {
    if (this.quizForm.valid) {
      const responses = this.quizForm.value.answers; // Get the student's answers

      // Initialize score to 0
      let score = 0;

      // Loop through all the responses and compare with the correct answers
      responses.forEach((response: any, index: number) => {
        const question = this.quiz.questions[index]; // Admin's question with the correct answer
        if (response.response === question.answer) {
          // Compare with the correct answer
          score += 1; // Increment score for correct answers
        }
      });

      // Open the confirmation dialog

      const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent);
      const quizStatus = score >= 3 ? 'Completed' : 'Failed';

      dialogRef.afterClosed().subscribe((result) => {
        // Proceed with the quiz submission if confirmed
        const submission = {
          quizId: this.quiz.id,
          quizTitle: this.quiz.title,
          studentName: this.userService.getUserName(),
          score: score, // Include the calculated score
          status: quizStatus,
          timestamp: new Date(),
          responses: responses,
        };

        this.http.post('http://localhost:3000/results', submission).subscribe({
          next: (response) => {
            console.log('Quiz submission successful:', response); // Debugging log
            this.router.navigate(['/student']); // Redirect after successful submission
          },
          error: (error) => {
            console.error('Error submitting quiz:', error); // Debugging log
          },
        });
      });
    } else {
      console.log('Quiz form is invalid');
    }
  }
}
