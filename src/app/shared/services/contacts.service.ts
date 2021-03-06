import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from './../models/contact.model';
import { Observable, Observer } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class ContactsService {

  private contacts: Contact[] = [];

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  public getContacts()
  {
    return new Observable((o: Observer<any>) => {
      this.http.get('http://localhost:8000/api/contacts', {
        headers: this.authService.getRequestHeaders(),
      })
        .subscribe(
          (contacts: any[]) => {
            contacts.forEach(c => {
              this.contacts.push(new Contact(c.id, c.first_name, c.last_name, c.email));
            });

            o.next(this.contacts);
            return o.complete();
          }
        );
    });
  }

  public addContact(contact: Contact)
  {
    return new Observable((o: Observer<any>) => {
      this.http.post('http://localhost:8000/api/contacts', {
        'first_name': contact.firstName,
        'last_name': contact.lastName,
        'email': contact.email,
      },
      {
        headers: this.authService.getRequestHeaders(),
      })
        .subscribe(
          (c: any) => {
            let newC = new Contact(c.id, c.first_name, c.last_name, c.email);
            this.contacts.push(newC);
            o.next(newC);
            return o.complete();
          }
        );
    });
  }

  public editContact(contact: Contact)
  {
    return new Observable((o: Observer<any>) => {
      this.http.put('http://localhost:8000/api/contacts/' + contact.id, {
        'first_name': contact.firstName,
        'last_name': contact.lastName,
        'email': contact.email,
      },
      {
        headers: this.authService.getRequestHeaders(),
      })
        .subscribe(
          (contact: any) => {
            let existing = this.contacts.filter(c => c.id == contact.id);
            if (existing.length) {
              existing[0].firstName = contact.first_name;
              existing[0].lastName = contact.last_name;
              existing[0].email = contact.email;
            }

            o.next(existing[0]);
            return o.complete();
          }
        );
    });
  }

  public removeContact(contact: Contact)
  {
    return new Observable((o: Observer<any>) => {
      this.http.delete('http://localhost:8000/api/contacts/' + contact.id,
        {
          headers: this.authService.getRequestHeaders(),
        })
        .subscribe(
          () => {
            const index = this.contacts.indexOf(contact);
            this.contacts.splice(index, 1);

            o.next(index);
            return o.complete();
          }
        );
    });
  }

  public getContactById(id: number)
  {
    return new Observable((o: Observer<any>) => {
      this.http.get('http://localhost:8000/api/contacts/' + id,
        {
          headers: this.authService.getRequestHeaders(),
        })
        .subscribe(
          (contact: any) => {
            o.next(new Contact(contact.id, contact.first_name, contact.last_name, contact.email));
            return o.complete();
          }
        );
    });
  }

}
