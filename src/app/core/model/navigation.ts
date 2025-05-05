export interface NavItem {
  name: string;
  icon: string;
  path: string;
  visible?: boolean;
  exclusions?: noVisiblePath[];
}

export interface noVisiblePath {
  path: string;
}
