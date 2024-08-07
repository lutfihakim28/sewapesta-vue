import { CustomException } from '@/exceptions/CustomException';
import { useRouter } from 'vue-router';

type Query = Record<string, string | number | Array<string | number>>

export function useRequest() {
  const baseUrl = 'http://localhost:3000/api';
  const router = useRouter();

  async function GET<R, Q extends Query | undefined = undefined>(endpoint: string, query?: Q): Promise<R> {
    try {
      const qs = new URLSearchParams();
      if (query) {
        for (const key in query) {
          if (query[key]) {
            qs.append(key, query[key].toString());
          }
        }
      }
      const url = baseUrl + endpoint + (query ? '?' : '') + qs.toString();
      const response = await fetch(url, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Cookie': getToken()
        },
      });
      const responseData = await response.json();
      if (responseData.code > 300) {
        if (responseData.code === 401) {
          localStorage.removeItem('sewapesta-token')
          router.push({ name: 'LoginPage' })
        }
        if (responseData.code === 422) {
          throw new CustomException(422, 'Data tidak valid.')
        }
        throw new CustomException(responseData.code, responseData.messages)
      }
      return Promise.resolve(responseData);
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function POST<R = void, P = undefined>(endpoint: string, payload?: P): Promise<R> {
    try {
      const url = baseUrl + endpoint;
      let response: Response;
      if (payload instanceof FormData) {
        response = await fetch(url, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Cookie': getToken(),
          },
          body: payload
        });
      } else {
        response = await fetch(url, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Cookie': getToken(),
            'content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      }
      const responseData = await response.json();
      if (responseData.code > 300) {
        if (responseData.code === 401) {
          localStorage.removeItem('sewapesta-token')
          router.push({ name: 'LoginPage' })
        }
        if (responseData.code === 422) {
          throw new CustomException(422, 'Data tidak valid.')
        }
        throw new CustomException(responseData.code, responseData.messages)
      }
      return Promise.resolve(responseData);
    } catch (error) {
      if (error instanceof CustomException) {
        return Promise.reject(error)
      }
      return Promise.reject()
    }
  }

  async function PUT<R = void, P = undefined>(endpoint: string, payload: P): Promise<R> {
    try {
      const url = baseUrl + endpoint;
      let response: Response;
      if (payload instanceof FormData) {
        response = await fetch(url, {
          credentials: 'include',
          method: 'PUT',
          headers: {
            'Cookie': getToken(),
          },
          body: payload
        });
      } else {
        response = await fetch(url, {
          credentials: 'include',
          method: 'PUT',
          headers: {
            'Cookie': getToken(),
            'content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      }
      const responseData = await response.json();
      if (responseData.code > 300) {
        if (responseData.code === 401) {
          localStorage.removeItem('sewapesta-token')
          router.push({ name: 'LoginPage' })
        }
        if (responseData.code === 422) {
          throw new CustomException(422, 'Data tidak valid.')
        }
        throw new CustomException(responseData.code, responseData.messages)
      }
      return Promise.resolve(responseData);
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function PATCH<R = void, P = undefined>(endpoint: string, payload: P): Promise<R> {
    try {
      const url = baseUrl + endpoint;
      let response: Response;
      if (payload instanceof FormData) {
        response = await fetch(url, {
          credentials: 'include',
          method: 'PATCH',
          headers: {
            'Cookie': getToken(),
          },
          body: payload
        });
      } else {
        response = await fetch(url, {
          credentials: 'include',
          method: 'PATCH',
          headers: {
            'Cookie': getToken(),
            'content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      }
      const responseData = await response.json();
      if (responseData.code > 300) {
        if (responseData.code === 401) {
          localStorage.removeItem('sewapesta-token')
          router.push({ name: 'LoginPage' })
        }
        if (responseData.code === 422) {
          throw new CustomException(422, 'Data tidak valid.')
        }
        throw new CustomException(responseData.code, responseData.messages)
      }
      return Promise.resolve(responseData);
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function DELETE<R>(endpoint: string): Promise<R> {
    try {
      const url = baseUrl + endpoint;
      const response = await fetch(url, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Cookie': getToken(),
        },
      });
      const responseData = await response.json();
      if (responseData.code > 300) {
        if (responseData.code === 401) {
          localStorage.removeItem('sewapesta-token')
          router.push({ name: 'LoginPage' })
        }
        if (responseData.code === 422) {
          throw new CustomException(422, 'Data tidak valid.')
        }
        throw new CustomException(responseData.code, responseData.messages)
      }
      return Promise.resolve(responseData);
    } catch (error) {
      return Promise.reject(error)
    }
  }

  function getToken(): string {
    const jwt = localStorage.getItem('sewapesta-token');
    return `token=${jwt}`;
  }

  return { GET, POST, PUT, PATCH, DELETE }
}