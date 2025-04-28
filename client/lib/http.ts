import envConfig from "@/configs/envConfig";

type CustomOptions = RequestInit & {
    baseUrl?: string | undefined;
}

type HttpErrorPayload = {
    success: boolean,
    message: string
}

export class HttpError extends Error {
    status: number;
    payload: any;
    constructor({status, payload}: { status: number; payload: any}) {
        super('Http Error');
        this.status = status;
        this.payload = payload;
    }

}

export const isClient = () => typeof window !== 'undefined'

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?: CustomOptions | undefined
) => {
    let body: FormData | string | undefined = undefined

    if (options?.body instanceof FormData) {
        body = options.body
    } else if (options?.body) {
        body = JSON.stringify(options.body)
    }
    const baseHeaders: {
        [key: string]: string
    } =
        body instanceof FormData
            ? {}
            : {
                'Content-Type': 'application/json'
            }
    if (isClient()) {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            baseHeaders.Authorization = `Bearer ${accessToken}`
        }
    }
    // baseUrl = '' -> Call api Next Server
    const baseUrl =
      options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_BACKEND_URL
      : options.baseUrl;

    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            ...baseHeaders,
            ...options?.headers
        } as any,
        body,
        method
    })
    // const { body: _, ...restOptions } = options || {};
    // const res = await fetch(fullUrl, {
    //     method: method,
    //     headers: {
    //         ...headers,
    //         ...restOptions.headers
    //     },
    //     body: body,
    //     ...restOptions,
    // });

    const payload: Response = await res.json()

    const data = {
        status: res.status,
        payload
    }

    // Interceptor là nơi chúng ta xử lý request và response trước khi trả về cho phía component
    if (!res.ok) {
        console.log('res error from http.ts', res);
         if(res.status === 400){        // 400 - Bad Request
            throw new HttpError(data as{
                status: 400,
                payload: HttpErrorPayload,
            });
        }else if (res.status === 401) {     // 401 - Unauthorized
            throw new HttpError(data as {
                status: 401,
                payload: HttpErrorPayload,
            });
        }  else if(res.status === 403){     // 403 - Forbidden
            throw new HttpError(data as {
                status: 403,
                payload: HttpErrorPayload,
            });
        } else if(res.status === 500){      // 500 - Internal Server Error
            throw new HttpError(data as{
                status: 500,
                payload: HttpErrorPayload,
            });
        } else {
             throw new HttpError({
                 status: res.status,
                 payload: payload as any,
             });
         }
    }
    return data;
}

const http = {
    get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('GET', url, options)
    },
    post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('POST', url, {...options, body} )
    },
    put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('PUT', url, {...options, body})
    },
    delete<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('DELETE', url, {...options, body})
    },
}

export default http;