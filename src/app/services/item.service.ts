import { Injectable, inject } from "@angular/core";
import { Observable,map} from "rxjs";
import { ItemApiService } from "../api/item.api-service";
import { ItemModel } from "../api/models/item/item.model";
import {Item} from "./models/item/item"
import { ItemCreate } from "./models/item/itemCreate";
import { ItemGetAll } from "./models/item/item.getall";
import { PaginationMetaData } from "../api/models/common/pagination.data.model";
import { PaginationData } from "./models/common/pagination.data";

@Injectable({providedIn:"root"})
export class ItemService{
        
    //Inject ApiService (Repository)
    private itemApiService:ItemApiService=inject(ItemApiService);
    
     // GetAll Items
     public getItems(pageNumber:number): Observable<ItemGetAll> {
        return this.itemApiService.getItems(pageNumber)
            .pipe(map(response => {
                const result = new ItemGetAll();
                result.items = response.items.map(apiModel => this.toModel(apiModel));
                console.log(response.paginationMetaData);
                
                result.paginationMetaData = this.toPaginationMetaData(response.paginationMetaData);
                return result;
            }));
    }

    //Create Item
    public addItem(itemCreate:ItemCreate): Observable<any> {
        return this.itemApiService.addItem(itemCreate);
    }

    //Delete Item
    public deleteItem(itemId:number):Observable<any>{
        return this.itemApiService.deleteItem(itemId);
    }

    //Edit Item
    public editItem(item:Item):Observable<any>{
        return this.itemApiService.editItem(item);
    }

    //ToModel Function for GetAll
    private toModel(apiModel:ItemModel):Item{
         const result=new Item();
         result.itemName=apiModel.itemName;
         result.itemId=apiModel.itemId;
         result.itemType=apiModel.itemType;
         result.itemDate=new Date(apiModel.itemDate);         
         return result;
    }

     // ToPaginationMetaData for Pagination
     private toPaginationMetaData(apiPaginationMetaData: PaginationMetaData): PaginationData {
        const result = new PaginationData();
        result.currentPage = apiPaginationMetaData.currentPage;
        result.totalPages = apiPaginationMetaData.totalPages;
        result.pageSize = apiPaginationMetaData.pageSize;
        result.totalItems = apiPaginationMetaData.totalItems;
        result.hasPrevious = apiPaginationMetaData.hasPrevious;
        result.hasNext = apiPaginationMetaData.hasNext;
        return result;
    }
}