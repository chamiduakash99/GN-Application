type ChipState = 'default' | 'saved' | 'new';

export interface ChipItem<T> {
  data: T;
  state: ChipState;
  originallySaved?: boolean;

}
