// import { fetchRefreshToken } from '~/fetches';
// import authentication from 'shared/authentication';
import api from '@/utils/api.js';
// import dayjs from 'shared/libs/dayjs';

export default async (req, isFormData) => {
  // 토큰이 있다면..
  // const certificate = authentication.get();
  // const left = dayjs(certificate.accessTokenExpiresAt).diff(+new Date(), 's');

  // if (
  //   //* 토큰이 유효하고,
  //   certificate.accessToken &&
  //   //* 남은 시간이 1초 이상이고,
  //   left > 0 &&
  //   //* 업데이트 한지 2초 이상이면,
  //   dayjs().diff(certificate.updateAt, 's') > 1
  // ) {
  //   //* 토큰 갱신
  //   try {
  //     const res = await fetchRefreshToken();
  //     authentication.set(res.data);
  //   } catch (e) {}
  // }

  return req.responseType === 'blob'
    ? api(req)
    : api(req,isFormData).then((res) => res.data);
};
