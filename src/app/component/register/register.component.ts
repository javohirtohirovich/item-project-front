import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRegister } from '../../services/models/user/userRegister';
import { LoadingComponent } from '../loading/loading.component';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule,LoadingComponent,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less',
})
export class RegisterComponent {
  
  private userService: UserService = inject(UserService);
  
  constructor(private toastr: ToastrService,public formRegister:FormGroup) {}  
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
          this.toastr.success("Successful Register!");          
          this.loading=false;
          this.router.navigate(["/login"])
        },
        error: (err) => {
          this.toastr.warning("Error during register!");
          this.loading=false;
        },
      });
    }
    else{
      this.loading=false;
      this.toastr.warning('Passwords do not match!');
    }
  }
}
