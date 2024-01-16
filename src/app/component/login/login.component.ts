import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { UserLogin } from '../../services/models/user/userLogin';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  private userService: UserService = inject(UserService);
  public userEmail: string = "";
  public password:string="";

  public loginUser(): void 
  {
    const userLoginModel=new UserLogin();
    userLoginModel.clientId=0;
    userLoginModel.grantType="password";
    userLoginModel.password=this.password;
    userLoginModel.userName=this.userEmail;

    this.userService.userLogin(userLoginModel).subscribe({
      next: (response) => {
        alert('Login Successful:');
      },
      error: (err) => {
        alert('Error during login');
      },
    });
  }

}
