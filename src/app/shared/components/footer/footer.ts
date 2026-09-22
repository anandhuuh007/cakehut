import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  footerGroups = [
    {
      label: 'Shop',
      links: [
        { title: 'Our Cakes', href: '/products' },
        { title: 'Breads', href: '/products' },
        { title: 'Pastries', href: '/products' },
        { title: 'Cafe', href: '/products' },
      ]
    },
    {
      label: 'Customer Support',
      links: [
        { title: 'Contact Us', href: '#' },
        { title: 'Help Center', href: '#' },
        { title: 'Policy and Terms', href: '#' },
      ]
    }
  ];
}
