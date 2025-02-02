import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    RouterLink
  ],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {
  slides = [
    {
      image: 'https://i0.wp.com/sanarmed.com/wp-content/uploads/2024/03/media-3799.jpg?fit=1920%2C1080&ssl=1',
      alt: 'Slide 1',
    },
    {
      image: 'https://digital.sebraers.com.br/wp-content/uploads/2023/09/sebrae-rs-healthtech-saude-e-inovacao.png',
      alt: 'Slide 2',
    },
    {
      image: 'https://wallpapers.com/images/hd/blue-hd-medical-stethoscope-macro-7douvbdkz3wnpgen.jpg',
      alt: 'Slide 3',
    },
  ];

  currentSlide = 0;

  // Lógica de navegação automática
  ngOnInit() {
    setInterval(() => {
      this.nextSlide();
    }, 3000); // Altere para o intervalo desejado em milissegundos (5 segundos)
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  getTranslateX(index: number): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }
}

