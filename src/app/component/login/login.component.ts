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
    imports: [RouterModule, FormsModule, CommonModule, LoadingComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.less'
})
export class LoginComponent {
    //Konstruktor
    constructor(private toastr: ToastrService) { };

    //Inject userService and Router
    private userService: UserService = inject(UserService);
    private router: Router = inject(Router);

    //Variables for login
    public userEmail: string = '';
    public password: string = '';

    //Variable for Loading
    public loading: boolean = false;

    //Variables for Error
    public emailError: string = '';
    public passwordError: string = '';

    //Function for login button
    public loginUser(): void {
        //Clear errorVariables
        this.resetErrors();
        
        //Validate LoginForm
        if (!this.validateForm()) {
            return;
        }

        //populate UserLoginModel with variables
        const userLoginModel = new UserLogin();
        userLoginModel.clientId = 0;
        userLoginModel.grantType = 'password';
        userLoginModel.password = this.password;
        userLoginModel.userName = this.userEmail;

        //Turn on Loadind
        this.loading = true;

        this.userService.userLogin(userLoginModel).subscribe({
            next: (response) => {
                //Turn off Loading
                this.loading = false;

                //Hide Login and Register Button
                AuthenticationOrchestrator.signaller.next(true);

                this.router.navigate(['/home']);
                this.toastr.success('Successful Login!');
            },
            error: (err) => {
                if (err.status == 404) {
                    this.toastr.warning('No such email user found!');
                }else if(err.status==422){
                    this.toastr.warning('Your password is incorrect!');
                } else {
                    this.toastr.warning('Error during login!');
                }
                //Turn off Loading                
                this.loading = false;
            }
        });
    }

    //Function Validate LoginForm
    private validateForm(): boolean {
        let isValid = true;

        if (!this.userEmail) {
            this.emailError = 'Email is required!';
            isValid = false;
        } else if (!this.isValidEmail(this.userEmail)) {
            this.emailError = 'Invalid email format!';
            isValid = false;
        }

        if (!this.password) {
            this.passwordError = 'Password is required!';
            isValid = false;
        }
        return isValid;
    }

    //Function Validate email
    private isValidEmail(email: string): boolean {
        const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
        return emailRegex.test(email);
    }

    //FUnction Clear error variables
    private resetErrors(): void {
        this.emailError = '';
        this.passwordError = '';
    }
}
