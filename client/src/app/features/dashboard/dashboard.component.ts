import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';
import { AccessRecord, AppUser, UserForm } from '../../core/models/api.models';
import { AuthService } from '../../core/services/auth.service';
import { RecordService } from '../../core/services/record.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  readonly profile = signal<AppUser | null>(null);
  readonly records = signal<AccessRecord[]>([]);
  readonly users = signal<AppUser[]>([]);
  readonly loadingRecords = signal(false);
  readonly loadingUsers = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly delayMs = signal(1500);

  userForm: UserForm = this.emptyUser();

  constructor(
    readonly auth: AuthService,
    private readonly usersApi: UserService,
    private readonly recordsApi: RecordService
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loadingRecords.set(true);
    this.error.set('');

    forkJoin({
      profile: this.usersApi.me(),
      records: this.recordsApi.list(this.delayMs())
    })
      .pipe(finalize(() => this.loadingRecords.set(false)))
      .subscribe({
        next: ({ profile, records }) => {
          this.profile.set(profile);
          this.records.set(records);
          this.auth.refreshProfile(profile);
          if (profile.role === 'Admin') {
            this.loadUsers();
          }
        },
        error: (error) => this.error.set(error?.error?.message ?? 'Unable to load dashboard data.')
      });
  }

  loadUsers() {
    this.loadingUsers.set(true);
    this.usersApi
      .list()
      .pipe(finalize(() => this.loadingUsers.set(false)))
      .subscribe({
        next: (users) => this.users.set(users),
        error: (error) => this.error.set(error?.error?.message ?? 'Unable to load users.')
      });
  }

  saveUser() {
    this.message.set('');
    this.error.set('');

    this.usersApi.create(this.userForm).subscribe({
      next: () => {
        this.message.set('User created successfully.');
        this.userForm = this.emptyUser();
        this.loadUsers();
      },
      error: (error) => this.error.set(error?.error?.message ?? 'Unable to create user.')
    });
  }

  setStatus(user: AppUser, status: 'Active' | 'Inactive') {
    this.usersApi.update(user.id, { status }).subscribe({
      next: () => this.loadUsers(),
      error: (error) => this.error.set(error?.error?.message ?? 'Unable to update user.')
    });
  }

  deleteUser(user: AppUser) {
    this.usersApi.delete(user.id).subscribe({
      next: () => {
        this.message.set(`${user.fullName} was removed.`);
        this.loadUsers();
      },
      error: (error) => this.error.set(error?.error?.message ?? 'Unable to delete user.')
    });
  }

  logout() {
    this.auth.logout();
  }

  private emptyUser(): UserForm {
    return {
      userId: '',
      password: '',
      fullName: '',
      email: '',
      role: 'General User',
      department: '',
      status: 'Active'
    };
  }
}
