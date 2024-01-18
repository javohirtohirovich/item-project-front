import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule, FormsModule,LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
})
export class HomeComponent implements OnInit {
  constructor(private toastr: ToastrService) {};

  public page_size: number = 10;

  public loading: boolean = false;

  //For ModalWindow Variables
  public modalDeleteVisible: boolean = false;
  public modalEditVisible: boolean = false;
  public modalAddVisible: boolean = false;

  //For GetItems Variables
  public itemService: ItemService = inject(ItemService);
  public items: Item[] = [];

  //For Add Variables
  public itemType: number = 0;
  public itemName: string = '';
  public itemDate: Date = new Date();

  //For Delete, Edit,
  public ItemId: number = 0;

  //For Edit Variables
  public itemTypeEdit: number = 0;
  public itemNameEdit: string = '';
  public itemDateEdit: Date = new Date();

  //For Pagination Variables
  public currentPage: number = 1;
  public totalPages: number = 1;
  public pagenationData: PaginationData = new PaginationData();

  private router: Router = inject(Router);
  
  public ngOnInit(): void {
    this.check_token();
    this.getItems(this.currentPage);
  }

  //Check Token
  public check_token():void{
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  }

  //GetAll Items
  getItems(page: number) {
    this.loading=true;
    this.itemService.getItems(page).subscribe((response) => {
      this.items = response.items;
      this.pagenationData = response.paginationMetaData;
      this.totalPages = response.paginationMetaData.totalPages;
    });
    this.loading=false;
  }

  //Delete Modal Function
  public showDeleteModal(itemId: number): void {
    this.ItemId = itemId;
    this.modalDeleteVisible = true;
  }

  public hideDeleteModal(): void {
    this.modalDeleteVisible = false;
  }

  public saveDeleteChanges(): void {
    this.loading=true;
    this.itemService.deleteItem(this.ItemId).subscribe({
      next: (response) => {
        this.getItems(this.currentPage);
        this.toastr.success("Success delete item!");          
      },
      error: (err) => {
        this.toastr.warning("Error during delete!");          
      },
    });
    this.getItems(this.currentPage);
    this.loading=false;
    this.modalDeleteVisible = false;
  }

  //Edit Modal Function
  public showEditModal(
    itemId: number,
    itemNameEdit: string,
    itemTypeEdit: number,
    itemDateEdit: Date
  ): void {
    this.ItemId = itemId;
    this.itemNameEdit = itemNameEdit;
    this.itemTypeEdit = itemTypeEdit;
    this.itemDateEdit = itemDateEdit;

    this.modalEditVisible = true;
  }

  public hideEditModal(): void {
    this.modalEditVisible = false;
  }

  public saveEditChanges(): void {
    this.loading=true;
    const itemModel = new Item();
    itemModel.itemId = this.ItemId;
    itemModel.itemName = this.itemName;
    itemModel.itemType = this.itemType;
    itemModel.itemDate = this.itemDate;
    this.itemService.editItem(itemModel).subscribe({
      next: (response) => {
        this.getItems(this.currentPage);
        this.toastr.success("Success edit item!");          
      },
      error: (err) => {
        this.toastr.warning("Error during edit!");          
      },
    });
    this.loading=false;
    this.modalEditVisible = false;
  }

  //Add Modal Function
  public showAddModal(): void {
    this.itemName = '';
    this.itemType = 0;
    this.itemDate = new Date();
    this.modalAddVisible = true;
  }

  public hideAddModal(): void {
    this.modalAddVisible = false;
  }

  public saveAddChanges(): void {
    this.loading=true;
    const itemCreateModel = new ItemCreate();
    itemCreateModel.itemName = this.itemName;
    itemCreateModel.itemType = this.itemType;
    itemCreateModel.itemDate = this.itemDate;
    this.itemService.addItem(itemCreateModel).subscribe({
      next: (response) => {
        this.getItems(this.currentPage);
        this.toastr.success("Success add item!");          
      },
      error: (err) => {
        this.toastr.warning("Error during add!");          
      },
    });
    this.loading=false;
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
}
