import { CommonModule } from '@angular/common';
import { Component,  DebugElement,  OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../services/models/item/item';
import { FormsModule } from '@angular/forms';
import { ItemCreate } from '../../services/models/item/itemCreate';
import { PaginationData } from '../../services/models/common/pagination.data';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit {
  public modalDeleteVisible: boolean = false;
  public modalEditVisible: boolean=false;
  public modalAddVisible: boolean=false;
  private itemService:ItemService=inject(ItemService);
  public items:Item[]=[];

  public itemType: number = 0;
  public itemName: string = "";
  public itemDate: Date =new Date();

  public ItemId:number=0;

  public currentPage: number = 1;
  public totalPages: number = 1;

  public pagenationData:PaginationData=new PaginationData();

  //Get Item
  public ngOnInit(): void {
    this.itemService.getItems(this.currentPage).subscribe(
      (response) => {
        debugger;
        this.items = response.items;
        this.pagenationData=response.paginationMetaData;
        this.totalPages=response.paginationMetaData.totalPages;
      }
  )}

  //Delete Modal Function
  public showDeleteModal(itemId: number): void {
    this.ItemId=itemId;
    this.modalDeleteVisible = true;
  }

  public hideDeleteModal(): void {
    this.modalDeleteVisible = false;
  }

  public saveDeleteChanges(): void {
    this.itemService.deleteItem(this.ItemId).subscribe({
      next: response => {
        console.log("Delete successful:", response);
        // You can handle the response here, e.g., update the UI or a list
      },
      error: err => {
        console.error("Error during delete:", err);
        // Handle the error here
      }
    });
    this.modalDeleteVisible = false;
  }

  //Edit Modal Function
  public showEditModal(itemId: number): void {
    this.ItemId=itemId;
    this.modalEditVisible = true;
  }

  public hideEditModal(): void {
    this.modalEditVisible = false;
  }

  public saveEditChanges(): void {
    const itemModel = new Item();
        itemModel.itemId=this.ItemId;        
        itemModel.itemName=this.itemName;
        itemModel.itemType=this.itemType;
        itemModel.itemDate=this.itemDate;
    this.itemService.editItem(itemModel).subscribe({
      next: response => {
        alert("Edit successful:");
      },
      error: err => {
        alert("Error during edit:");
      }
    });
    this.modalEditVisible = false;
  }

  //Add Modal Function
  public showAddModal(): void {
    this.modalAddVisible = true;
  }

  public hideAddModal(): void {
    this.modalAddVisible = false;
  }

  public saveAddChanges(): void {
    const itemCreateModel = new ItemCreate();        
        itemCreateModel.itemName=this.itemName;
        itemCreateModel.itemType=this.itemType;
        itemCreateModel.itemDate=this.itemDate;
    this.itemService.addItem(itemCreateModel).subscribe({
      next: response => {
        alert("Add successful:");
      },
      error: err => {
        alert("Error during add:");
      }
    });
    this.modalAddVisible = false;
  }

  

}
