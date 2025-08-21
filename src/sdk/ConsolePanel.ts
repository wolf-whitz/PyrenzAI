export class ConsolePanel {
  private headerStyle =
    'background:#4cafef; color:#fff; font-weight:bold; padding:4px 10px; border-radius:4px 4px 0 0; display:block;';
  private boxStyle =
    'background:#1e1e1e; color:#ddd; padding:6px 12px; border-left:2px solid #4cafef; border-right:2px solid #4cafef; display:block;';
  private footerStyle =
    'background:#4cafef; padding:2px; border-radius:0 0 4px 4px; display:block;';

  panel(title: string, messages: string[]) {
    console.log('%c' + title, this.headerStyle);
    messages.forEach((msg) => console.log('%c' + msg, this.boxStyle));
    console.log('%c ', this.footerStyle);
  }
}

export const consolePanel = new ConsolePanel();
