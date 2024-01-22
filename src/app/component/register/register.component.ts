import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRegister } from '../../services/models/user/userRegister';
import { LoadingComponent } from '../loading/loading.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterModule, CommonModule, FormsModule, LoadingComponent],
    templateUrl: './register.component.html',
    styleUrl: './register.component.less',
})
export class RegisterComponent {

    //Konstruktor
    constructor(private toastr: ToastrService) { }

    //Inject UserService and Router
    private userService: UserService = inject(UserService);
    private router: Router = inject(Router);

    //Variables for register
    public userName: string = '';
    public userLastName: string = '';
    public userEmail: string = '';
    public password: string = '';
    public passwordConfirm: string = '';

    //Variable for loading
    public loading: boolean = false;

    //Function for register
    public registerUser(): void {
        //Loading turn on
        this.loading = true;

        if (this.password === this.passwordConfirm) {

            //populate UserRegister with variables
            const userRegister = new UserRegister();
            userRegister.userName = this.userName;
            userRegister.userLastName = this.userLastName;
            userRegister.userEmail = this.userEmail;
            userRegister.password = this.password;

            this.userService.userRegister(userRegister).subscribe({
                next: (response) => {
                    this.toastr.success("Successful Register!");
                    this.loading = false;
                    this.router.navigate(["/login"])
                },
                error: (err) => {
                    this.toastr.warning("Error during register!");
                    this.loading = false;
                },
            });
        }
        else {
            this.loading = false;
            this.toastr.warning('Passwords do not match!');
        }
    }
}
