import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../shared/stat-card/stat-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

  username = localStorage.getItem('username') || 'Admin';

  currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  cards = [
    {
      title: 'Products',
      value: '1,248',
      icon: 'inventory_2',
      change: '+12.5%',
      status: 'up'
    },
    {
      title: 'Warehouses',
      value: '12',
      icon: 'warehouse',
      change: '+8.3%',
      status: 'up'
    },
    {
      title: 'Stock Units',
      value: '45.5K',
      icon: 'layers',
      change: '+15.2%',
      status: 'up'
    },
    {
      title: 'Low Stock Alerts',
      value: '14',
      icon: 'warning',
      change: '-3.1%',
      status: 'down'
    }
  ];

  activities = [
    {
      title: 'New product added: Wireless Mouse',
      time: '2 minutes ago',
      icon: 'inventory_2'
    },
    {
      title: 'Stock updated in Main Warehouse',
      time: '15 minutes ago',
      icon: 'warehouse'
    },
    {
      title: 'Purchase order received',
      time: '1 hour ago',
      icon: 'description'
    },
    {
      title: 'Low stock alert for Laptop Stand',
      time: '2 hours ago',
      icon: 'warning'
    }
  ];

  bestProducts = [
    {
      name: 'Wireless Earbuds Pro',
      sold: '1,245 sold'
    },
    {
      name: 'Bluetooth Speaker Mini',
      sold: '1,102 sold'
    },
    {
      name: 'Smart Watch Series 9',
      sold: '890 sold'
    }
  ];
}