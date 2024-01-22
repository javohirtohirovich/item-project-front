import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { UserLogin } from '../../services/models/user/userLogin';
import { AuthenticationOrchestrator } from '../models/authentication-orchestrator';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule,LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  //Inject userService
  private userService: UserService = inject(UserService);
  constructor(private toastr: ToastrService) {};
  public userEmail: string = '';
  public password: string = '';
  public loading: boolean = false;
  private router: Router = inject(Router);

  public emailError: string = '';
  public passwordError: string = '';


  public loginUser(): void {
    this.resetErrors();

    if (!this.validateForm()) {
      return;
    }

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
        this.router.navigate(['/home']);
        this.toastr.success('Successful Login!');
      },
      error: (err) => {
        if (err.status == 404) {
          this.toastr.warning('No such email user found!');
        } else {
          this.toastr.warning('Error during login!');
        }
        this.loading = false;
      },
    });
  }


  private validateForm(): boolean {
    let isValid = true;

    if (!this.userEmail) {
      this.emailError = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.userEmail)) {
      this.emailError = 'Invalid email format';
      isValid = false;
    }

    if (!this.password) {
      this.passwordError = 'Password is required';
      isValid = false;
    }
   

    return isValid;
  }

  private isValidEmail(email: string): boolean {
    
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

    return emailRegex.test(email);
  }

  private resetErrors(): void {
    this.emailError = '';
    this.passwordError = '';
  }
}
