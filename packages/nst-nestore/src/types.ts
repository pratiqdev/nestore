export type Thang = string;
export type Whut = string | number;

declare global {
  interface Window {
    nestore?: () => unknown;
  }
}
