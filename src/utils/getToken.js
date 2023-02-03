import request from './request';
import store from '@/store';
import qs from 'qs';

export default function getToken() {
  const uname = store.state.SYS || store.state.uname || '';
  const role = uname === 'HIS' ? 'HIS系统' : store.state.role;
  return request({
    baseURL: setting.ms_url,
    url: 'oauth/token',
    method: 'POST',
    headers: {
      Authorization: 'Basic ZW1yOmJXVmthV05oYkMxbGJYST0='
    },
    getTokenMethod: true,
    data: qs.stringify({
      grant_type: 'password',
      username: uname,
      password: '123456',
      role: role
    })
  });
}
