import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule], // Import necessary Angular Material modules
  template: `
    <mat-card>
      <mat-card-title>Registered Students</mat-card-title>
      <mat-table [dataSource]="students">
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef> Name </mat-header-cell>
          <mat-cell *matCellDef="let student"> {{ student.name }} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="role">
          <mat-header-cell *matHeaderCellDef> Role </mat-header-cell>
          <mat-cell *matCellDef="let student"> {{ student.role }} </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      </mat-table>
    </mat-card>
  `,
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  displayedColumns: string[] = ['name', 'role'];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchStudents(); // Fetch the users on component initialization
  }

  fetchStudents(): void {
    this.authService.getUsers().subscribe((users) => {
      // Filter users by the role 'student'
      this.students = users.filter((user) => user.role === 'student');
    });
  }
}
