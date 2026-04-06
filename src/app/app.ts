import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  protected title = 'frontend';
  
  private isDragging = false;
  private meshGradientTween: gsap.core.Tween | undefined;
  private mouseMoveListener: (e: MouseEvent) => void;
  private touchMoveListener: (e: TouchEvent) => void;
  private mouseUpListener: () => void;
  private touchEndListener: () => void;

  constructor() {
    this.mouseMoveListener = (e: MouseEvent) => {
      if (!this.isDragging) return;
      this.updateSlider(e.clientX);
    };

    this.touchMoveListener = (e: TouchEvent) => {
      if (!this.isDragging) return;
      this.updateSlider(e.touches[0].clientX);
    };

    this.mouseUpListener = () => { this.isDragging = false; };
    this.touchEndListener = () => { this.isDragging = false; };
  }

  ngAfterViewInit() {
    this.initHeroParallax();
    this.initRevealAnimations();
    this.initComparisonSlider();
    this.initMeshGradientAnimation();
  }

  ngOnDestroy() {
    if (this.meshGradientTween) {
      this.meshGradientTween.kill();
    }
    ScrollTrigger.getAll().forEach(t => t.kill());
    window.removeEventListener('mousemove', this.mouseMoveListener);
    window.removeEventListener('touchmove', this.touchMoveListener);
    window.removeEventListener('mouseup', this.mouseUpListener);
    window.removeEventListener('touchend', this.touchEndListener);
  }

  private updateSlider(x: number) {
    const sliderContainer = document.getElementById('comparison-slider');
    const handle = document.getElementById('slider-handle');
    const afterLayer = document.getElementById('after-layer');
    
    if (!sliderContainer || !handle || !afterLayer) return;

    const rect = sliderContainer.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));
    
    handle.style.left = `${position}%`;
    afterLayer.style.clipPath = `inset(0 0 0 ${position}%)`;
  }

  private initComparisonSlider() {
    const sliderContainer = document.getElementById('comparison-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mousedown', () => this.isDragging = true);
      sliderContainer.addEventListener('touchstart', () => this.isDragging = true);
    }
    window.addEventListener('mouseup', this.mouseUpListener);
    window.addEventListener('mousemove', this.mouseMoveListener);
    window.addEventListener('touchend', this.touchEndListener);
    window.addEventListener('touchmove', this.touchMoveListener);
  }

  private initHeroParallax() {
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        gsap.to('#hero-parallax', {
            duration: 1.5,
            rotationY: mouseX * 15,
            rotationX: -mouseY * 15,
            ease: "power2.out"
        });
    });
  }

  private initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out"
        });
    });
  }

  private initMeshGradientAnimation() {
    this.meshGradientTween = gsap.to(".mesh-gradient", {
        backgroundPosition: "100% 100%",
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
  }
}