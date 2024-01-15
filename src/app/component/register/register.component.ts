import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRegister } from '../../services/models/user/userRegister';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less',
})
export class RegisterComponent {
  private userService: UserService = inject(UserService);

  public userName: string = '';
  public userLastName: string = '';
  public userEmail: string = '';
  public password: string = '';
  public passwordConfirm: string = '';


  public registerUser(): void {
    if (this.password === this.passwordConfirm) {
      const userRegister = new UserRegister();
      userRegister.userName = this.userName;
      userRegister.userLastName = this.userLastName;
      userRegister.userEmail = this.userEmail;
      userRegister.password = this.password;

      
      this.userService.userRegister(userRegister).subscribe({
        next: (response) => {
          alert('Register Successful:');
        },
        error: (err) => {
          alert('Error during register:');
        },
      });
    }
    else{
      alert('Passwords do not match. Please check and try again.');
    }
  }
}
