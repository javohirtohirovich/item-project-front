import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { ItemModel } from "./models/item/item.model";
import {ItemCreateModel} from "./models/item/itemCreate.model"
import { ItemGetAllModel } from "./models/item/item.getall.model";
@Injectable({ providedIn: "root" })
export class ItemApiService {
    private apiUrl = "https://localhost:7274/api/item"; // API manzili

    private page_size:number=10;
    private client: HttpClient=inject(HttpClient);
    
    public getItems(pageNumber: number): Observable<ItemGetAllModel> {
        const url = `${this.apiUrl}?page=${pageNumber}&pageSize=${this.page_size}`;
        return this.client.get<ItemGetAllModel>(url).pipe(
          catchError((error) => {
            console.error("Error in getItems:", error);
            throw error;
          })
        );
      }

    public addItem(item : ItemCreateModel ): Observable<any> {
        return this.client.post(this.apiUrl,item);
    }

    public deleteItem(itemId:number):Observable<any>{
        return this.client.delete(`${this.apiUrl}?id=${itemId}`);
    }
    public editItem(item:ItemModel):Observable<any>{
        return this.client.put(this.apiUrl,item);
    }
}
