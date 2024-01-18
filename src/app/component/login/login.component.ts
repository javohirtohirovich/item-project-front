import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { UserLogin } from '../../services/models/user/userLogin';
import { AuthenticationOrchestrator } from '../models/authentication-orchestrator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  private userService: UserService = inject(UserService);
  public userEmail: string = '';
  public password: string = '';
  public loading: boolean = false;
  private router: Router = inject(Router);


  public loginUser(): void {
    const userLoginModel = new UserLogin();
    userLoginModel.clientId = 0;
    userLoginModel.grantType = 'password';
    userLoginModel.password = this.password;
    userLoginModel.userName = this.userEmail;
    this.loading = true;

    this.userService.userLogin(userLoginModel).subscribe({
      next: (response) => {
        this.loading = false;
        AuthenticationOrchestrator.signaller.next(true);
        this.router.navigate(["/home"])
        // redirect here!
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
}
