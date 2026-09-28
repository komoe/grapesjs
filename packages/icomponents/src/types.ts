// types.ts;
export interface ApiJsItem {
  name: string;
  html: string;
  js: string;
}
export interface ApiJsDetail {
  jsId: number;
  type: number;
  name: string;
  description: string;
  menu: string;
  param: string | null;
  code: string;
  typeName: string;
}
export interface ApiResponse {
  code: number;
  message: string;
  data: ApiJsDetail;
}
