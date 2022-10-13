export interface MenuItem {
  // @TODO: eduardo: el "id" deberia ser obligatorio
  id?: string;
  label: string;
  icon: string;
  badge?: number;
  routerLink?: string[];
  command?: () => void;
  url?: string;
  target?: string;
  items?: MenuItem[];
}
