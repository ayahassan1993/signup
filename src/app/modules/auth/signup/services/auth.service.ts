import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private httpClint: HttpClient) { }


    getUsersPhons(filterText: string) {
        return this.httpClint.get(`user/getByPhoneNumber?phoneNumber=${filterText}`)
    }

    signup(body: any) {
        return this.httpClint.post('user/signup', body)
    }
}