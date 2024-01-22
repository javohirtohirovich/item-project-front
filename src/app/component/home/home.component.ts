import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {  Router, RouterModule } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../services/models/item/item';
import { FormsModule } from '@angular/forms';
import { ItemCreate } from '../../services/models/item/itemCreate';
import { PaginationData } from '../../services/models/common/pagination.data';
import { LoadingComponent } from '../loading/loading.component';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, LoadingComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.less',
})
export class HomeComponent implements OnInit {
    //Konstruktor
    constructor(private toastr: ToastrService) { };

    //Inject ItemService and Router
    public itemService: ItemService = inject(ItemService);
    private router: Router = inject(Router);

    //Variable for loadin
    public loading: boolean = false;

    //For ModalWindow Variables
    public modalDeleteVisible: boolean = false;
    public modalEditVisible: boolean = false;
    public modalAddVisible: boolean = false;

    //For GetItems list
    public items: Item[] = [];

    //For Add Variables
    public itemType: number = 0;
    public itemName: string = '';
    public itemDate: Date|null=null;

    //For Delete, Edit,
    public itemId: number = 0;

    //For Edit Variables
    public itemTypeEdit: number = 0;
    public itemNameEdit: string = '';
    public itemDateEdit: Date = new Date();

    //For Pagination Variables
    public page_size: number = 10;
    public currentPage: number = 1;
    public totalPages: number = 1;
    public pagenationData: PaginationData = new PaginationData();

    //Variables For Error
    public itemNameError:string='';
    public itemTypeError:string='';
    public itemDateError:string='';

    //NgOnInit Function
    public ngOnInit(): void {
        this.check_token();
        this.getItems(this.currentPage);
    }

    //Check Token
    public check_token(): void {
        const token = localStorage.getItem('access_token');
        if (!token) {
            this.router.navigate(['/login']);
            return;
        }
    }

    //GetAll Items
    public getItems(page: number): void {
        this.loading = true;
        this.itemService.getItems(page).subscribe((response) => {
            this.items = response.items;
            this.pagenationData = response.paginationMetaData;
            this.totalPages = response.paginationMetaData.totalPages;
            this.loading = false;
        });
    }

    //Delete Modal Function
    public showDeleteModal(itemId: number): void {
        this.itemId = itemId;
        this.modalDeleteVisible = true;
    }

    public hideDeleteModal(): void {
        this.modalDeleteVisible = false;
    }

    public saveDeleteChanges(): void {
        this.loading = true;
        this.itemService.deleteItem(this.itemId).subscribe({
            next: (response) => {
                this.getItems(this.currentPage);
                this.toastr.success('Success delete item!');
            },
            error: (err) => {
                this.toastr.warning('Error during delete!');
            },
        });
        this.getItems(this.currentPage);
        this.loading = false;
        this.modalDeleteVisible = false;
    }

    //Edit Modal Function
    public showEditModal(
        itemId: number,
        itemNameEdit: string,
        itemTypeEdit: number,
        itemDateEdit: Date
    ): void {
         //Clear errorVariables
         this.resetErrors();
        this.itemId = itemId;
        this.itemNameEdit = itemNameEdit;
        this.itemTypeEdit = itemTypeEdit;
        this.itemDateEdit = itemDateEdit;

        this.modalEditVisible = true;
    }

    public hideEditModal(): void {
        this.modalEditVisible = false;
    }

    public saveEditChanges(): void {
          //Clear errorVariables
          this.resetErrors();
        
          //Validate LoginForm
          if (!this.validateForm(this.itemNameEdit,this.itemTypeEdit,this.itemDateEdit)) {
              return;
         }
        this.loading = true;
        const itemModel = new Item();
        itemModel.itemId = this.itemId;
        itemModel.itemName = this.itemNameEdit;
        itemModel.itemType = this.itemTypeEdit;
        itemModel.itemDate = this.itemDateEdit;
        this.itemService.editItem(itemModel).subscribe({
            next: (response) => {
                this.getItems(this.currentPage);
                this.toastr.success('Success edit item!');
            },
            error: (err) => {
                this.toastr.warning('Error during edit!');
            },
        });
        this.loading = false;
        this.modalEditVisible = false;
    }

    //Add Modal Function
    public showAddModal(): void {
         //Clear errorVariables
         this.resetErrors();
        this.itemName = '';
        this.itemType = 0;
        this.itemDate = null;
        this.modalAddVisible = true;
    }

    public hideAddModal(): void {
        this.modalAddVisible = false;
    }

    public saveAddChanges(): void {
         //Clear errorVariables
         this.resetErrors();
        
         //Validate LoginForm
         if (!this.validateForm(this.itemName,this.itemType,this.itemDate)) {
             return;
        }
        this.loading = true;
        const itemCreateModel = new ItemCreate();
        itemCreateModel.itemName = this.itemName;
        itemCreateModel.itemType = this.itemType;
        itemCreateModel.itemDate = this.itemDate;
        this.itemService.addItem(itemCreateModel).subscribe({
            next: (response) => {
                this.getItems(this.currentPage);
                this.toastr.success('Success add item!');
            },
            error: (err) => {
                this.toastr.warning('Error during add!');
            },
        });
        this.loading = false;
        this.modalAddVisible = false;
    }

    //Pagination Helper Function

    public changePage(page: number): void {
        if (page < 1 || page > this.totalPages) {
            return;
        }
        this.currentPage = page;
        this.getItems(this.currentPage);
    }

    public hangePage(page: number): void {
        if (page < 1 || page > this.totalPages) {
            return;
        }
        this.currentPage = page;
        this.itemService.getItems(this.currentPage);
    }

    get pageNumbers(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    //Validate AddModal Form
    
    //Function Validate LoginForm
    private validateForm(itemName:string,itemType:number,itemDate:Date|null): boolean {
        let isValid = true;

        if (!itemName) {
            this.itemNameError = 'Item name is required!';
            isValid = false;
        } else if (!this.isValidItemName(itemName)) {
            this.itemNameError = 'Item name is invalid format!';
            isValid = false;
        }

        if(!itemType){
            this.itemTypeError='Item type is required!';
            isValid=false;
        }else if(!this.isValudItemType(itemType)){
            this.itemTypeError='Item type must be numeric only!';
            isValid=false;
        }
        
        if(!itemDate){
            this.itemDateError='Item date is requred!'
            isValid=false;
        }
      
        return isValid;
    }

    //Function Validate itemName
    private isValidItemName(name: string): boolean {
        const nameRegex = /^[a-zA-Z0-9_-]{3,15}$/;
        return nameRegex.test(name);
    }

    //Function Validate itemType
    private isValudItemType(type:number){
        const typeRegex=/^[0-9]{1,15}$/;
        return typeRegex.test(type.toString());
    }

    //FUnction Clear error variables
    private resetErrors(): void {
        this.itemNameError = '';
        this.itemTypeError = '';
        this.itemDateError='';
    }

}
