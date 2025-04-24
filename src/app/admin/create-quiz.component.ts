import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
  ],
  template: `
    <h2>Create Quiz</h2>
    <form [formGroup]="quizForm" (ngSubmit)="submitQuiz()">
      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Quiz Title</mat-label>
        <input matInput formControlName="title" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Timer (minutes)</mat-label>
        <input matInput type="number" formControlName="timer" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Number of Questions</mat-label>
        <input
          matInput
          type="number"
          (input)="generateQuestions($any($event.target).value)"
        />
      </mat-form-field>

      <div
        formArrayName="questions"
        *ngFor="let question of questions.controls; let i = index"
      >
        <div
          [formGroupName]="i"
          class="p-2 mb-4 border border-gray-300 rounded"
        >
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Question {{ i + 1 }}</mat-label>
            <input matInput formControlName="text" />
          </mat-form-field>

          <label class="block mb-2">Correct Answer</label>
          <mat-radio-group formControlName="answer">
            <mat-radio-button value="Yes">Yes</mat-radio-button>
            <mat-radio-button value="No">No</mat-radio-button>
            <mat-radio-button value="Partial">Partial</mat-radio-button>
            <mat-radio-button value="N/A">N/A</mat-radio-button>
          </mat-radio-group>
        </div>
      </div>

      <button mat-raised-button color="primary" type="submit" class="mr-2">
        Submit
      </button>
      <button mat-button type="button" (click)="closeDialog()">Cancel</button>
    </form>
  `,
  styles: [
    `
      .w-full {
        width: 100%;
      }
      .mr-2 {
        margin-right: 8px;
      }
    `,
  ],
})
export class CreateQuizComponent {
  quizForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<CreateQuizComponent>
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      timer: [0, Validators.required],
      questions: this.fb.array([]),
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  generateQuestions(count: number) {
    this.questions.clear();
    for (let i = 0; i < count; i++) {
      this.questions.push(
        this.fb.group({
          text: ['', Validators.required],
          answer: ['Yes', Validators.required], // Default to 'Yes'
        })
      );
    }
  }

  submitQuiz() {
    if (this.quizForm.valid) {
      this.http
        .post('http://localhost:3000/quizzes', this.quizForm.value)
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
