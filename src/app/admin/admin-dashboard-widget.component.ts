import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard-widget',
  standalone: true,
  imports: [CommonModule, NgIf, MatCardModule],
  templateUrl: './admin-dashboard-widget.component.html',
  styleUrls: ['./admin-dashboard-widget.component.css'],
})
export class AdminDashboardWidgetComponent implements OnInit {
  totalQuizzes = 0;
  completedQuizzes = 0;
  inProgressQuizzes = 0;
  failedQuizzes = 0;
  totalStudents = 0;

  students: any[] = [];
  // Chart properties
  pieChartType: 'pie' = 'pie';
  pieChartLabels: string[] = ['Completed', 'In Progress', 'Failed'];

  // Wrapping data inside datasets array for the chart
  pieChartData: ChartDataset<'pie'>[] = [
    {
      data: [0, 0, 0],
      backgroundColor: ['#00C853', '#FFEB3B', '#D32F2F'],
    },
  ];

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    animation: false,
  };

  showChart = true;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics() {
    this.http
      .get<any[]>('http://localhost:3000/quizzes')
      .subscribe((quizzes) => {
        this.totalQuizzes = quizzes.length;
        this.completedQuizzes = quizzes.filter(
          (q) => q.status === 'Completed'
        ).length;
        this.inProgressQuizzes = quizzes.filter(
          (q) => q.status === 'In Progress'
        ).length;
        this.failedQuizzes = quizzes.filter(
          (q) => q.status === 'Failed'
        ).length;

        // Update the chart data dynamically
        this.pieChartData[0].data = [
          this.completedQuizzes,
          this.inProgressQuizzes,
          this.failedQuizzes,
        ];

        // Fetch student data
        this.authService.getUsers().subscribe((users) => {
          this.students = users.filter((user) => user.role === 'student');
          this.totalStudents = this.students.length;
        });
      });
  }
}
