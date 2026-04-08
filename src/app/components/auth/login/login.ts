import { Component, AfterViewInit, ElementRef, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styles: ``
})
export class Login implements AfterViewInit {
  private el = inject(ElementRef);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        const leftSide = document.getElementById('auth-left');
        const rightSide = document.getElementById('auth-right');

        if (leftSide && rightSide) {
          gsap.set([leftSide, rightSide], { opacity: 0 });
          gsap.set(leftSide, { x: -50 });
          gsap.set(rightSide, { x: 50 });

          const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
          tl.to(leftSide, { opacity: 1, x: 0 })
            .to(rightSide, { opacity: 1, x: 0 }, '-=0.6');
        }
      }, 50);
    });
  }

  async transitionTo(path: string, event: Event) {
    event.preventDefault();
    const leftSide = document.getElementById('auth-left');
    const rightSide = document.getElementById('auth-right');

    if (leftSide && rightSide) {
      const tl = gsap.timeline({ 
        defaults: { ease: 'power3.in', duration: 0.5 },
        onComplete: () => {
          this.ngZone.run(() => {
            this.router.navigateByUrl(path);
          });
        }
      });

      tl.to(leftSide, { opacity: 0, x: -50 })
        .to(rightSide, { opacity: 0, x: 50 }, '-=0.4');
    } else {
      this.router.navigateByUrl(path);
    }
  }
}
