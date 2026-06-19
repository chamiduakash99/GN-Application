import { Component, Input, OnInit } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AsyncPipe, CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";

export interface Group<T> {
  letter: string;
  items: T[];
}

@Component({
  selector: 'app-group-autocomplete',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule
  ],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <input type="text"
             matInput
             [formControl]="control"
             [placeholder]="placeholder"
             [matAutocomplete]="autoGroup"/>

      <mat-autocomplete #autoGroup="matAutocomplete" [displayWith]="displayFn">
        <mat-optgroup *ngFor="let group of filteredGroups | async" [label]="group.letter">
          <mat-option *ngFor="let item of group.items"  [value]="item">
            {{ item[displayKey] }}
          </mat-option>
        </mat-optgroup>
      </mat-autocomplete>
    </mat-form-field>
  `
})
export class AppGroupAutocompleteComponent<T extends Record<string, any>> implements OnInit {

  @Input() control!: FormControl<T | string>;
  @Input() options: T[] = [];
  @Input() displayKey: keyof T = 'code';
  @Input() label = 'Select item';
  @Input() placeholder = '';

  filteredGroups!: Observable<Group<T>[]>;

  ngOnInit(): void {
    this.filteredGroups = this.control.valueChanges.pipe(
      startWith(''),
      map(value => {
        // ✅ Normalize value: string or object
        const search = typeof value === 'string'
          ? value
          : (value?.[this.displayKey] as string);

        return this.groupAndFilter(search || '');
      })
    );
  }


  private groupAndFilter(value: string): Group<T>[] {
    const filterValue = value.toLowerCase().trim();

    // Group by first character of displayKey
    const grouped: { [letter: string]: T[] } = {};
    this.options.forEach(opt => {
      const keyVal = String(opt[this.displayKey]);
      const letter = keyVal.charAt(0).toUpperCase();

      // Only add if it matches the filter
      if (!filterValue || keyVal.toLowerCase().includes(filterValue)) {
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(opt);
      }
    });

    // Convert to array of groups
    // ✅ Only return groups that have items
    return Object.keys(grouped)
      .sort()
      .map(letter => ({ letter, items: grouped[letter] }))
      .filter(group => group.items.length > 0);
  }
  displayFn = (item: T | string): string => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return String(item[this.displayKey]); // e.g. item.code
  };


}
