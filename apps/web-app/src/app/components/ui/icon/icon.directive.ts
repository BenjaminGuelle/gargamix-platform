import { Directive, input, ElementRef, effect, inject } from '@angular/core';

@Directive({
  selector: 'i[name]',
  standalone: true,
})
export class IconDirective {
  #el: ElementRef = inject(ElementRef);
  name = input.required<string>();

  constructor() {
    effect(() => {
      const iconName = this.name();
      if (iconName) {
        this.#loadIcon(iconName);
      }
    });
  }

  #loadIcon(name: string) {
    fetch(`icons/${name}.svg`)
      .then(response => response.text())
      .then(svg => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');

        if (svgEl) {
          // Supprime les dimensions hardcodées
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
          svgEl.setAttribute('class', 'w-full h-full'); // pour hériter de <i>

          this.#el.nativeElement.innerHTML = '';
          this.#el.nativeElement.appendChild(svgEl);
        }
      })
      .catch(() => {
        console.warn(`Icône "${name}" introuvable`);
      });
  }

}