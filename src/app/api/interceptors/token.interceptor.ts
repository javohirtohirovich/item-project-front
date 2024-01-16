//import { APP_BASE_HREF } from "@angular/common";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class TokenInterceptor implements HttpInterceptor {
    //private baseHref: string = inject(APP_BASE_HREF);

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const userToken = localStorage.getItem("access_token");
        let nextReq: HttpRequest<any>;

        if (userToken) {
            nextReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${userToken}`),
                url: this.prepend(req.url)
            });
        } else {
            nextReq = req.clone({
                url: this.prepend(req.url)
            });
        }

        return next.handle(nextReq);
    }

    private prepend(url: string): string {
        let base = "https://localhost:7274/api/auth/v1";
        if (base.endsWith("/")) {
            base = base.substring(0, base.length - 1);
        }
        let ending = url;
        if (ending.startsWith("/")) {
            ending = ending.substring(1);
        }
        return `${base}/${ending}`;
    }
}