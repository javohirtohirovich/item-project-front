import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ItemModel } from "./models/item/item.model";
import {ItemCreateModel} from "./models/item/itemCreate.model"
@Injectable({ providedIn: "root" })
export class ItemApiService {
    private apiUrl = "https://localhost:7274/api/item"; // API manzili

    private client: HttpClient=inject(HttpClient);
    
    public getItems(): Observable<ItemModel[]> {
        return this.client.get<ItemModel[]>(this.apiUrl);
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
