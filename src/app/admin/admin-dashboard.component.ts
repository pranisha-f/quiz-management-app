import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CreateQuizComponent } from './create-quiz.component';
import { Router } from '@angular/router';
import { StudentListComponent } from './student-list.component';
import { UserService } from '../services/user.service';
import { QuizTableComponent } from './quiz-table.component';
import { AdminDashboardWidgetComponent } from './admin-dashboard-widget.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    QuizTableComponent,
    AdminDashboardWidgetComponent,
    StudentListComponent,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidebar -->
      <mat-sidenav #sidenav mode="side" opened class="sidebar">
        <mat-nav-list>
          <!-- Home Link -->
          <a
            mat-list-item
            (click)="setActiveTab('home')"
            [class.active]="activeTab === 'home'"
          >
            <mat-icon>home</mat-icon>
          </a>
          <!-- Students Link -->
          <a
            mat-list-item
            (click)="setActiveTab('students')"
            [class.active]="activeTab === 'students'"
          >
            <mat-icon>people</mat-icon>
          </a>
          <!-- Logout Link -->
          <a mat-list-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Main content area -->
      <mat-sidenav-content class="content">
        <div *ngIf="activeTab === 'home'" class="dashboard-layout">
          <h1>Admin Dashboard</h1>
          <div class="left-content">
            <app-admin-dashboard-widget></app-admin-dashboard-widget>
            <span class="right-content">
              <button
                mat-raised-button
                color="accent"
                (click)="openCreateQuiz()"
              >
                Create Quiz
              </button>
            </span>
          </div>
          <div class="quiz-table-container">
            <!-- The Quiz Table component is placed below -->
            <app-quiz-table></app-quiz-table>
          </div>
        </div>

        <div *ngIf="activeTab === 'students'" class="students-container">
          <app-student-list></app-student-list>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog
  ) {}
  activeTab: string = 'home'; // Default active tab

  // Set the active tab when a button is clicked
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  logout() {
    this.userService.clearUserData;
    this.router.navigate(['/login']);
  }

  openCreateQuiz() {
    this.dialog.open(CreateQuizComponent, {
      width: '500px',
      disableClose: true,
    });
  }
}
