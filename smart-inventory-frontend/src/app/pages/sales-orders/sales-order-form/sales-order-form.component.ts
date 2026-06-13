import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WarehouseService } from '../../../services/warehouse.service';
import {
  SalesOrder,
  SalesOrderService,
  WarehouseProduct
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
  warehouseProducts: WarehouseProduct[] = [];

  orderId: number | null = null;
  loading = false;
  saving = false;
  productsLoading = false;

  userRole: Role = 'ADMIN';

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private salesOrderService: SalesOrderService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
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

    this.loadWarehouses();

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
    this.cdr.detectChanges();
  }

  removeItem(index: number): void {
    if (this.items.length === 1) return;
    this.items.removeAt(index);
    this.cdr.detectChanges();
  }

  loadWarehouses(): void {
    this.warehouseService.getWarehouses().subscribe({
      next: data => {
        this.warehouses = [...(data || [])];
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Warehouses load error:', error);
        this.warehouses = [];
        this.cdr.detectChanges();
      }
    });
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.salesOrderService.getOrderById(id).subscribe({
      next: order => {
        const warehouseId = order.warehouse?.id || '';

        this.form.patchValue({
          customerName: order.customerName || '',
          warehouseId
        });

        this.loadWarehouseProducts(Number(warehouseId), false, () => {
          this.items.clear();

          for (const item of order.items || []) {
            this.items.push(
              this.fb.group({
                productId: [item.product?.id || '', Validators.required],
                quantity: [item.quantity || 1, [Validators.required, Validators.min(1)]],
                unitPrice: [item.unitPrice || 0, [Validators.required, Validators.min(0)]]
              })
            );
          }

          if (this.items.length === 0) {
            this.addItem();
          }

          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: error => {
        console.error('Sales order load error:', error);
        this.loading = false;
        this.cdr.detectChanges();
        alert('Failed to load sales order');
      }
    });
  }

  onWarehouseChange(): void {
    const warehouseId = Number(this.form.get('warehouseId')?.value);

    this.warehouseProducts = [];

    this.items.controls.forEach(row => {
      row.patchValue({
        productId: '',
        quantity: 1,
        unitPrice: 0
      });
    });

    if (!warehouseId) {
      this.cdr.detectChanges();
      return;
    }

    this.loadWarehouseProducts(warehouseId, true);
  }

  loadWarehouseProducts(
    warehouseId: number,
    showAlertIfEmpty = false,
    afterLoad?: () => void
  ): void {
    if (!warehouseId) {
      this.warehouseProducts = [];
      if (afterLoad) afterLoad();
      this.cdr.detectChanges();
      return;
    }

    this.productsLoading = true;
    this.cdr.detectChanges();

    this.salesOrderService.getProductsByWarehouse(warehouseId).subscribe({
      next: data => {
        this.warehouseProducts = [...(data || [])];
        this.productsLoading = false;

        if (showAlertIfEmpty && this.warehouseProducts.length === 0) {
          alert('This warehouse has no available products in stock.');
        }

        if (afterLoad) afterLoad();

        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Warehouse products load error:', error);
        this.warehouseProducts = [];
        this.productsLoading = false;

        if (afterLoad) afterLoad();

        this.cdr.detectChanges();
        alert('Failed to load products for selected warehouse');
      }
    });
  }

  onProductChange(index: number): void {
    const row = this.items.at(index);
    const productId = Number(row.get('productId')?.value);

    const product = this.warehouseProducts.find(p => Number(p.id) === productId);

    if (product) {
      row.patchValue({
        unitPrice: Number(product.price) || 0
      });
    } else {
      row.patchValue({
        unitPrice: 0
      });
    }

    this.cdr.detectChanges();
  }

  getAvailableQuantity(index: number): number | null {
    const row = this.items.at(index);
    const productId = Number(row.get('productId')?.value);

    if (!productId) return null;

    const product = this.warehouseProducts.find(p => Number(p.id) === productId);

    return product ? Number(product.availableQuantity) : null;
  }

  getProductStockClass(index: number): string {
    const available = this.getAvailableQuantity(index);
    if (available === null) return '';

    if (available <= 5) return 'low-stock';
    return 'good-stock';
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
      this.cdr.detectChanges();
      return;
    }

    for (let i = 0; i < this.items.length; i++) {
      const quantity = Number(this.items.at(i).get('quantity')?.value);
      const available = this.getAvailableQuantity(i);

      if (available === null) {
        alert('Please select product from selected warehouse.');
        return;
      }

      if (quantity > available) {
        alert(`Quantity is more than available stock. Available: ${available}`);
        return;
      }
    }

    this.saving = true;
    this.cdr.detectChanges();

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
        this.cdr.detectChanges();

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/sales-orders']);
        });
      },
      error: error => {
        console.error('Save sales order error:', error);
        this.saving = false;
        this.cdr.detectChanges();
        alert(error.error || 'Failed to save sales order');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/sales-orders']);
  }
}