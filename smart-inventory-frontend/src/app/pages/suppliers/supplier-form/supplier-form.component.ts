import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import {
  Supplier,
  SupplierService
} from '../../../services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.css'
})
export class SupplierFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  supplierId = 0;

  supplier: Supplier = {
    supplierName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  };

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.supplierId = Number(id);
      this.loadSupplier();
    }
  }

  loadSupplier(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.supplierService.getSupplierById(this.supplierId).subscribe({
      next: (data) => {
        this.supplier = {
          id: data.id,
          supplierName: data.supplierName || '',
          contactPerson: data.contactPerson || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          createdAt: data.createdAt
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('LOAD SUPPLIER ERROR:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveSupplier(): void {
    if (!this.supplier.supplierName.trim()) {
      alert('Supplier name is required');
      return;
    }

    if (this.isEdit) {
      this.supplierService
        .updateSupplier(this.supplierId, this.supplier)
        .subscribe(() => {
          this.router.navigate(['/suppliers']);
        });
    } else {
      this.supplierService
        .addSupplier(this.supplier)
        .subscribe(() => {
          this.router.navigate(['/suppliers']);
        });
    }
  }
}