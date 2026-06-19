export class UiAssist {
  component: any;

  constructor(com: any) {
    this.component = com;
  }

  getProperty(element: any, reference: string): any {
    if (!reference.endsWith("()")) {
      const value = reference.split('.').reduce((o, a) => {
        if (o == null) {
          return null; // stop if null/undefined
        }
        return o[a];
      }, element);

      return value ?? ''; // return empty string if null/undefined
    } else {
      reference = reference.substring(0, reference.indexOf('('));
      return this.component[reference](element);
    }
  }
}
