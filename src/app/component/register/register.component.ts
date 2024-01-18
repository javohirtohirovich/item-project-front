import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRegister } from '../../services/models/user/userRegister';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule,LoadingComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less',
})
export class RegisterComponent {
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  
  public userName: string = '';
  public userLastName: string = '';
  public userEmail: string = '';
  public password: string = '';
  public passwordConfirm: string = '';

  public loading: boolean = false;

  public registerUser(): void {
    this.loading=true;
    if (this.password === this.passwordConfirm) {
      const userRegister = new UserRegister();
      userRegister.userName = this.userName;
      userRegister.userLastName = this.userLastName;
      userRegister.userEmail = this.userEmail;
      userRegister.password = this.password;

      
      this.userService.userRegister(userRegister).subscribe({
        next: (response) => {
          alert('Register Successful:');          
          this.loading=false;
          this.router.navigate(["/login"])
        },
        error: (err) => {
          alert('Error during register:');
          this.loading=false;
        },
      });
    }
    else{
      this.loading=false;
      alert('Passwords do not match. Please check and try again.');
    }
  }
}
