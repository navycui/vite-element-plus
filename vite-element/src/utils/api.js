import axios from 'axios';

const xhr = axios.create();
xhr.defaults.withCredentials = true;
xhr.defaults.timeout = 1000 * 5 * 60; // 5분

xhr.interceptors.response.use(
  (response) => {
    // resetJWT(response);
    return response;
  },
  (error) => {
    if (error.code == "ERR_NETWORK") {
      return Promise.reject(error);
    }
    if (!error.response) {
      return Promise.reject(error);
    }
    // resetJWT(error.response);
    let errorData = error.response.data;
    if (errorData instanceof Blob) {
      if (errorData.type != "application/json") {
        return;
      }
      var reader = new FileReader();
      reader.onload = (e) => {
        const json = JSON.parse(e.target.result);

        // alertError(error.response.status, json);
        return Promise.reject(json);
      };

      reader.readAsText(errorData);
      return Promise.reject(error);
    }
      // alertError(error.response.status, errorData);
    return Promise.reject(error);
  }
);

const process = {};
let config = null;
export const setup = (params) => {
  config = {
    ...params,
    withCredentials: true
  };
};

export default async (req, isFormData) => {
  if (!config) {
    console.error('API Config 설정을 먼저 해야 합니다.');
  }
  // const token = authentication.getToken();
  let headers = {};
  // if (token) {
  //   headers = {
  //     Auth: 'Bearer ' + token,
  //   };
  // }
  headers['Front-Referer'] = window.location.href
  if (isFormData) {
    headers['Content-Type'] = 'multipart/form-data'
  }

  //* 요청한 URL로 이미 진행 중인 API 가 있다면, 진행 중인 Promise 반환
  const key = req.url;
  if (process[key]) return process[key];

  process[key] = xhr({headers, ...config, ...req});
  return process[key].then(clear).catch((e) => Promise.reject(clear(e)));
};
//* 성공, 실패 모두 키값 삭제
function clear(res) {
  const key = res.config.url;
  delete process[key];
  return res;
}

// const Headers = (type) => {
// //   const token = authentication.getToken();
//   // const location = useLocation()
//   const headers = {
//     'Content-Type': 'application/json;charset=UTF-8',
//     'Front-Referer': window.location.href
//   };

//   if (type && type == "formData")
//     headers['Content-Type'] = 'multipart/form-data'
//   // if (token) {
//   //   headers['Auth'] = `Bearer ${token}`;
//   // }

//   return headers;
// }

const _request = async (type,url,data,opts) => {

  let resData = null;
  const headers = Headers(opts.contentType);

  // const key = url;
  // if (process[key]) return process[key];

  try {
    let res = null;

    if (type === 'GET') {
      res = await xhr.get(url, {
        ...config,
        baseURL: opts && opts.baseURL? opts.baseURL : config.baseURL,
        headers: headers, params: data,
        responseType: opts && opts.responseType,
        cancelToken: opts && opts.cancelRef && new axios.CancelToken(opts.cancelRef),
        paramsSerializer: paramsObj => {
          const params = new URLSearchParams()
          for ( const key in paramsObj) {
            if(paramsObj[key] !== undefined)
            params.append(key, paramsObj[key])
          }
          return params.toString();
        }
      }).then(clear);
    } else if (type === 'POST') {
      res = await xhr.post(url, data, {
        ...config,
        headers: headers,
        baseURL: opts && opts.baseURL? opts.baseURL : config.baseURL,
        cancelToken: opts && opts.cancelRef && new axios.CancelToken(opts.cancelRef),
      }).then(clear);
    } else if (type === 'DELETE') {
      res = await xhr.delete(url, {
        ...config,
        data: data,
        headers: headers,
        baseURL: opts && opts.baseURL? opts.baseURL : config.baseURL,
        cancelToken: opts && opts.cancelRef && new axios.CancelToken(opts.cancelRef),
      }).then(clear);
    } else if (type === 'PUT') {
      res = await xhr.put(url, data, {
        ...config,
        headers: headers,
        baseURL: opts && opts.baseURL? opts.baseURL : config.baseURL,
        cancelToken: opts && opts.cancelRef && new axios.CancelToken(opts.cancelRef),
      }).then(clear);
    }
    resData = res.data;
    if (resData) resData.success = res.status == 200

  } catch (e) {
    // clear(e);

    // cancelRef를 사용해서 요청을 취소시켰을 경우
    // if (axios.isCancel(e)) {
    //   console.debug(['API CANCEL', {url}]);
    //   // @ts-ignore
    //   throw [{message: e.message, url}];
    // }

    // // status가 200이 아닌 모든 경우
    // // @ts-ignore
    // const {data, status} = e.response;
    // if (status === 403 || status === 401) {
    //   alert(data.message)
    //   throw [{message: 'Access Denied', url}];
    // }

    // if (status == 500) alert(data.message)
    // if (status == 400) alert(data.message)

    // console.warn(['API ERROR', {url, status, data}]);
    // throw [{message: data.message, url, status}];
  }

  // 서버에서 반환된 에러 처리
  // GET은 서버 정의 에러가 없으며 문제가 발생한다면 null이 반환된다
  // if (type == 'POST' && resData && !resData.success) {
  //   throw resData.errors;
  // }
  return resData;
}
