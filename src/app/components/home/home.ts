import { Component, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styles: ``
})
export class Home implements AfterViewInit, OnDestroy {
  private isDragging = false;
  private meshGradientTween: gsap.core.Tween | undefined;
  private mouseMoveListener: (e: MouseEvent) => void;
  private touchMoveListener: (e: TouchEvent) => void;
  private mouseUpListener: () => void;
  private touchEndListener: () => void;
  private lenis: Lenis | undefined;
  private tickerFunc: ((time: number) => void) | undefined;
  private mouseMoveParallax: ((e: MouseEvent) => void) | undefined;

  constructor(private ngZone: NgZone) {
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
    
    this.mouseMoveParallax = (e: MouseEvent) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        gsap.to('#hero-parallax', {
            duration: 1,
            rotationY: mouseX * 10,
            rotationX: -mouseY * 10,
            ease: "power2.out",
            overwrite: 'auto'
        });
    };
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initLenis();
      this.initAnchorLinks();
      this.initHeroParallax();
      this.initRevealAnimations();
      this.initComparisonSlider();
      this.initPipelineAnimation();
      this.initLiquidMeshAnimation();

      // Refresh ScrollTrigger after a short delay to ensure layout is stable
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    });
  }

  ngOnDestroy() {
    if (this.meshGradientTween) {
      this.meshGradientTween.kill();
    }
    if (this.tickerFunc) {
      gsap.ticker.remove(this.tickerFunc);
    }
    if (this.lenis) {
      this.lenis.destroy();
    }
    ScrollTrigger.getAll().forEach(t => t.kill());
    window.removeEventListener('mousemove', this.mouseMoveListener);
    window.removeEventListener('touchmove', this.touchMoveListener);
    window.removeEventListener('mouseup', this.mouseUpListener);
    window.removeEventListener('touchend', this.touchEndListener);
    if (this.mouseMoveParallax) {
      document.removeEventListener('mousemove', this.mouseMoveParallax);
    }
  }

  private initAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = (anchor as HTMLAnchorElement).getAttribute('href')?.slice(1);
        if (id) {
          const target = document.getElementById(id);
          if (target) {
            e.preventDefault();
            this.lenis?.scrollTo(target, { offset: -100 });
          }
        }
      });
    });
  }

  private initLenis() {
    this.lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      gestureOrientation: 'vertical',
      autoRaf: false
    });

    this.tickerFunc = (time: number) => {
      this.lenis?.raf(time * 4000);
    };

    gsap.ticker.add(this.tickerFunc);
    gsap.ticker.lagSmoothing(0);

    this.lenis.on('scroll', ScrollTrigger.update);
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
    if (this.mouseMoveParallax) {
      document.addEventListener('mousemove', this.mouseMoveParallax);
    }
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

  private initPipelineAnimation() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#how-it-works",
        start: "top top",
        end: "+=2500",
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    const steps = gsap.utils.toArray('.pipeline-step');
    const pipelinePaths = gsap.utils.toArray('.pipeline-path');
    
    pipelinePaths.forEach((path: any) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
    });
    
    // Ensure initial state
    gsap.set(steps, { opacity: 0, y: 50 });

    tl.to(steps[0] as Element, { opacity: 1, y: 0, duration: 1 })
      .to('#pipeline-circle-1', { backgroundColor: '#0051d5', color: '#ffffff', borderColor: 'rgba(0, 81, 213, 0.2)', duration: 0.5 }, "-=0.5");

    pipelinePaths.forEach((path: any) => {
      const length = path.getTotalLength();
      tl.to(path, { strokeDashoffset: length * 0.5, duration: 3, ease: "power1.inOut" }, "draw-1-to-2");
    });

    tl.to(steps[1] as Element, { opacity: 1, y: 0, duration: 1 }, ">-0.5")
      .to('#pipeline-circle-2', { backgroundColor: '#0051d5', color: '#ffffff', borderColor: 'rgba(0, 81, 213, 0.2)', duration: 0.5 }, "-=0.5");

    pipelinePaths.forEach((path: any) => {
      tl.to(path, { strokeDashoffset: 0, duration: 3, ease: "power1.inOut" }, "draw-2-to-3");
    });

    tl.to(steps[2] as Element, { opacity: 1, y: 0, duration: 1 }, ">-0.5")
      .to('#pipeline-circle-3', { backgroundColor: '#0051d5', color: '#ffffff', borderColor: 'rgba(0, 81, 213, 0.2)', duration: 0.5 }, "-=0.5");
  }

  private initLiquidMeshAnimation() {
    const blobs = gsap.utils.toArray('.blob');
    blobs.forEach((blob) => {
      this.animateBlob(blob as HTMLElement);
    });
  }

  private animateBlob(blob: HTMLElement) {
    const duration = 3 + Math.random() * 4;
    gsap.to(blob, {
      x: () => (Math.random() - 0.5) * 600,
      y: () => (Math.random() - 0.5) * 600,
      scale: () => 0.6 + Math.random() * 0.6,
      duration: duration,
      ease: "sine.inOut",
      onComplete: () => this.animateBlob(blob)
    });
  }
}
