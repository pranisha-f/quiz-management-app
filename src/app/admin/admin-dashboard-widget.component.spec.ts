import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardWidgetComponent } from './admin-dashboard-widget.component';

describe('AdminDashboardWidgetComponent', () => {
  let component: AdminDashboardWidgetComponent;
  let fixture: ComponentFixture<AdminDashboardWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
