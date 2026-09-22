import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

@Component({
  selector: 'app-testimonials-column',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="className">
      <div 
        class="flex flex-col gap-6 pb-6 bg-transparent animate-scroll-vertical"
        [style.animation-duration.s]="duration"
      >
        <ng-container *ngFor="let _ of [0, 1]">
          <div *ngFor="let t of testimonials" class="p-8 rounded-3xl border border-zinc-200/60 bg-white shadow-xl shadow-primary/5 max-w-xs w-full transition-transform hover:scale-[1.02] duration-300">
            <div class="text-zinc-600 text-sm leading-relaxed">"{{t.text}}"</div>
            <div class="flex items-center gap-3 mt-6">
              <img [src]="t.image" [alt]="t.name" class="h-12 w-12 rounded-full object-cover border-2 border-primary/20 shadow-sm" />
              <div class="flex flex-col">
                <div class="font-bold tracking-tight leading-5 text-zinc-900">{{t.name}}</div>
                <div class="text-xs leading-5 text-zinc-500 font-medium tracking-tight mt-0.5">{{t.role}}</div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    @keyframes scroll-vertical {
      0% { transform: translateY(0); }
      100% { transform: translateY(-50%); }
    }
    .animate-scroll-vertical {
      animation: scroll-vertical linear infinite;
    }
  `]
})
export class TestimonialsColumnComponent {
  @Input() className: string = '';
  @Input() testimonials: Testimonial[] = [];
  @Input() duration: number = 10;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TestimonialsColumnComponent],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css'
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [
    {
      text: "The handcrafted cakes here are absolutely divine. Every bite is a testament to the baker's passion and skill. Our family's favorite bakery!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      name: "Briana Patton",
      role: "Loyal Customer"
    },
    {
      text: "We ordered a custom wedding cake and it exceeded all our expectations. It was beautiful and tasted even better. Highly recommended!",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
      name: "Bilal Ahmed",
      role: "Groom"
    },
    {
      text: "The best pastries I've ever had! The strawberry cream cake is a slice of heaven. The service is also incredibly warm and welcoming.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      name: "Saman Malik",
      role: "Food Blogger"
    },
    {
      text: "Their signature fudge cake is dangerously good. It's rich, moist, and perfectly balanced. A must-try for any chocolate lover out there.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      name: "Omar Raza",
      role: "Local Guide"
    },
    {
      text: "I buy all my office event treats from Sweet Layers. They always deliver on time and the quality is consistently spectacular.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      name: "Zainab Hussain",
      role: "Office Manager"
    },
    {
      text: "The red velvet supreme is my absolute favorite. The cream cheese frosting is light and perfectly sweetened. Outstanding bakery!",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      name: "Aliza Khan",
      role: "Regular Customer"
    },
    {
      text: "The ambiance of the shop and the quality of their baked goods make it my go-to spot for weekend treats. Friendly staff and amazing flavors.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
      name: "Farhan Siddiqui",
      role: "Pastry Enthusiast"
    },
    {
      text: "Ordered a birthday cake last minute and they were so accommodating. The cake was gorgeous and delicious. Will definitely return!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      name: "Sana Sheikh",
      role: "Mother of Two"
    },
    {
      text: "I love their commitment to using premium ingredients. You can really taste the difference in every single pastry they make.",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop",
      name: "Hassan Ali",
      role: "Chef"
    }
  ];

  firstColumn: Testimonial[] = [];
  secondColumn: Testimonial[] = [];
  thirdColumn: Testimonial[] = [];

  ngOnInit() {
    this.firstColumn = this.testimonials.slice(0, 3);
    this.secondColumn = this.testimonials.slice(3, 6);
    this.thirdColumn = this.testimonials.slice(6, 9);
  }
}
