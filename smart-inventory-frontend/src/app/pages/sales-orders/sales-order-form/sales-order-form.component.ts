import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService, Product } from '../../../services/product.service';
import { WarehouseService } from '../../../services/warehouse.service';
import {
  SalesOrder,
  SalesOrderService
} from '../../../services/sales-order.service';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'EMPLOYEE'
  | 'PURCHASING_MANAGER';

@Component({
  selector: 'app-sales-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales-order-form.component.html',
  styleUrl: './sales-order-form.component.css'
})
export class SalesOrderFormComponent implements OnInit {
  form!: FormGroup;

  warehouses: any[] = [];
  products: Product[] = [];

  orderId: number | null = null;
  loading = false;
  saving = false;

  userRole: Role = 'ADMIN';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private salesOrderService: SalesOrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = (localStorage.getItem('role') as Role) || 'ADMIN';

    if (!this.canCreateOrEditSalesOrder()) {
      alert('Access denied. You are not allowed to create or edit sales orders.');
      this.router.navigate(['/sales-orders']);
      return;
    }

    this.buildForm();

    this.orderId = Number(this.route.snapshot.paramMap.get('id')) || null;

    this.loadDropdowns();

    if (this.orderId) {
      this.loadOrder(this.orderId);
    }
  }

  canCreateOrEditSalesOrder(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  buildForm(): void {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      warehouseId: ['', Validators.required],
      items: this.fb.array([])
    });

    this.addItem();
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length === 1) return;
    this.items.removeAt(index);
  }

  loadDropdowns(): void {
    this.productService.getProducts().subscribe({
      next: data => this.products = data
    });

    this.warehouseService.getWarehouses().subscribe({
      next: data => this.warehouses = data
    });
  }

  loadOrder(id: number): void {
    this.loading = true;

    this.salesOrderService.getOrderById(id).subscribe({
      next: order => {
        this.form.patchValue({
          customerName: order.customerName,
          warehouseId: order.warehouse?.id
        });

        this.items.clear();

        for (const item of order.items || []) {
          this.items.push(
            this.fb.group({
              productId: [item.product?.id, Validators.required],
              quantity: [item.quantity, [Validators.required, Validators.min(1)]],
              unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]]
            })
          );
        }

        if (this.items.length === 0) {
          this.addItem();
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to load sales order');
      }
    });
  }

  onProductChange(index: number): void {
    const row = this.items.at(index);
    const productId = Number(row.get('productId')?.value);

    const product = this.products.find(p => p.id === productId);

    if (product) {
      row.patchValue({
        unitPrice: product.price || 0
      });
    }
  }

  getItemTotal(index: number): number {
    const row = this.items.at(index);

    const quantity = Number(row.get('quantity')?.value) || 0;
    const unitPrice = Number(row.get('unitPrice')?.value) || 0;

    return quantity * unitPrice;
  }

  getGrandTotal(): number {
    return this.items.controls.reduce((sum, _, index) => {
      return sum + this.getItemTotal(index);
    }, 0);
  }

  submit(): void {
    if (!this.canCreateOrEditSalesOrder()) {
      alert('Access denied.');
      this.router.navigate(['/sales-orders']);
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const value = this.form.value;

    const order: SalesOrder = {
      customerName: value.customerName,
      warehouse: {
        id: Number(value.warehouseId),
        warehouseName: ''
      },
      items: value.items.map((item: any) => ({
        product: {
          id: Number(item.productId),
          productName: '',
          sku: '',
          price: Number(item.unitPrice)
        },
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
      }))
    };

    const request = this.orderId
      ? this.salesOrderService.updateOrder(this.orderId, order)
      : this.salesOrderService.createOrder(order);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/sales-orders']);
      },
      error: error => {
        this.saving = false;
        alert(error.error || 'Failed to save sales order');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/sales-orders']);
  }
}