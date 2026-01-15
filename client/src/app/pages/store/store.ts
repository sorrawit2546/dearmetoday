import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { ProductItems } from '../../components/product-items/product-items';

@Component({
  selector: 'app-store',
  imports: [Header, ProductItems],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store {

}
