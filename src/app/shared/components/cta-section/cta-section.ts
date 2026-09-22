import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GradientTextComponent } from '../ui/gradient-text/gradient-text.component';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, RouterLink, GradientTextComponent],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.css'
})
export class CtaSectionComponent {
  titleLine1 = 'Ready to';
  titleLine2 = 'Taste the Magic?';
  subtitle = 'Order your custom cake today or explore our signature collections. Perfect for weddings, birthdays, and special occasions.';
  ctaText = 'ORDER NOW';
  ctaLink = '/products';
  backgroundImage = '/cta/ChatGPT%20Image%20May%2021,%202026,%2002_11_13%20PM.png';
  
  contactInfo = {
    website: 'sweetlayers.com',
    phone: '+1 (555) 123-BAKE',
    address: '123 Pastry Lane, Sweet Town'
  };
}
