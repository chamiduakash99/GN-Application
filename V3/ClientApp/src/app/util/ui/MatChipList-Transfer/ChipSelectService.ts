import { Injectable } from '@angular/core';
import {ChipItem} from "./chip-item.model";

@Injectable({ providedIn: 'root' })
export class ChipSelectService {

  /**
   * Build chip list from any array
   */
  buildChips<T>(items: T[]): ChipItem<T>[] {
    return items.map(item => ({ data: item, state: 'default' }));
  }

  /**
   * Mark chips as 'saved' based on a match function
   * Call this when Fill Form is clicked
   */
  // fillForm<T>(chips: ChipItem<T>[], savedItems: T[], matchFn: (a: T, b: T) => boolean): void {
  //   chips.forEach(chip => chip.state = 'default');
  //   savedItems.forEach(saved => {
  //     const chip = chips.find(c => matchFn(c.data, saved));
  //     if (chip) chip.state = 'saved';
  //   });
  // }
  fillForm<T>(
    chips: ChipItem<T>[],
    savedItems: T[],
    matchFn: (a: T, b: T) => boolean
  ): void {

    chips.forEach(chip => {
      chip.state = 'default';
      chip.originallySaved = false;
    });

    savedItems.forEach(saved => {

      const chip = chips.find(c => matchFn(c.data, saved));

      if (chip) {
        chip.state = 'saved';
        chip.originallySaved = true;
      }

    });
  }
  /**
   * Toggle chip state and sync the result array
   * Returns updated resultArray
   */
  // toggleChip<T>(chip: ChipItem<T>, resultArray: T[]): T[] {
  //
  //
  //   if (chip.state === 'default') {
  //     chip.state = 'new';
  //     resultArray.push(chip.data);
  //   } else {
  //     chip.state = 'default';
  //     const index = resultArray.indexOf(chip.data);
  //     if (index !== -1) resultArray.splice(index, 1);
  //   }
  //
  //   return resultArray;
  // }
  toggleChip<T>(chip: ChipItem<T>, resultArray: T[]): T[] {

    if (chip.state === 'default') {

      // restore previous saved state
      if (chip.originallySaved) {
        chip.state = 'saved';
      } else {
        chip.state = 'new';
      }

      resultArray.push(chip.data);

    } else {

      chip.state = 'default';

      const index = resultArray.indexOf(chip.data);

      if (index !== -1) {
        resultArray.splice(index, 1);
      }

    }

    return resultArray;
  }
}
