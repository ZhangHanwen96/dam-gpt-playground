declare module '@tezign/commons.js/http' {
  export default class http {
    public static defaults: any
    public static postForm<T>(url: string, options?): Promise<T>
    public static get<T>(url: string, options?): Promise<T>
    public static post<T>(url: string, data?, options?): Promise<T>
    public static put<T>(url: string, data?, options?): Promise<T>
    public static patch<T>(url: string, data?, options?): Promise<T>
    public static delete<T>(url: string, options?): Promise<T>
    public static on(name: string, handler)
    public static trigger(name: string, data)
  }
}
