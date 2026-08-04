import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

type ChipState = 'default' | 'saved' | 'new';

@Directive({
  standalone: true,
  selector: '[appChipState]'
})
export class ChipStateDirective implements OnInit {

  @Input() appChipState: ChipState = 'default';

  // private stateColorMap: Record<ChipState, { bg: string; color: string }> = {
  //   default: { bg: '#e0e0e0', color: '#333' },
  //   saved:   { bg: '#43a047', color: '#fff' },
  //   new:     { bg: '#1e88e5', color: '#fff' }
  // };
  private stateColorMap: Record<ChipState, { bg: string; color: string }> = {

    default: {
      bg: 'linear-gradient(135deg, #757f9a, #d7dde8)',
      color: '#1f2937'
    },

    saved: {
      bg: 'linear-gradient(135deg, #11998e, #38ef7d)',
      color: '#ffffff'
    },

    new: {
      bg: 'linear-gradient(135deg, #396afc, #2948ff)',
      color: '#ffffff'
    }

  };
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.applyStyle(this.appChipState);
  }

  ngOnChanges(): void {
    this.applyStyle(this.appChipState);
  }

  // private applyStyle(state: ChipState): void {
  //   const { bg, color } = this.stateColorMap[state];
  //   this.renderer.setStyle(this.el.nativeElement, 'background', bg);
  //   this.renderer.setStyle(this.el.nativeElement, 'color', color);
  //   this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  //   this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.2s ease');
  // }
  private applyStyle(state: ChipState): void {

    const { bg, color } = this.stateColorMap[state];

    this.renderer.setStyle(this.el.nativeElement, 'background', bg);

    this.renderer.setStyle(this.el.nativeElement, 'color', color);


    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');

    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.2s ease');

  }
}
