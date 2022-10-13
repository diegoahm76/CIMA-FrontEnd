export class Arrays {
  static createRange(from: number, to: number): number[] {
    let range: number[] = [];
    let i: number;
    for (i = from; i < to; i++) {
      range.push(i);
    }
    return range;
  }
}
