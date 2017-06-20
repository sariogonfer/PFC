import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'transform_sanitizer'})
export class TransformSanitizer implements PipeTransform {
  constructor(private sanitizer:DomSanitizer){}

  transform(deltaX) {
    return this.sanitizer.bypassSecurityTrustStyle("translateX(" + deltaX + "px)");
  }
}
