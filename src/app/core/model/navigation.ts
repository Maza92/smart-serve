export interface NavItem {
  key: string;
  name: string;
  icon: string;
  path: string;
  children?: NavItem[];
  fullPath?: string;
  parentKey?: string;
}
