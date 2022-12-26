import api from '@/utils/axios/index3';

function download(data, filename, mime) {
  const blobData = [data];
  const blob = new Blob(blobData, {
    type: mime || 'application/octet-stream',
  });
  const blobURL =
    window.URL && window.URL.createObjectURL
      ? window.URL.createObjectURL(blob)
      : window.webkitURL.createObjectURL(blob);

  const element = document.createElement('a');
  element.style.display = 'none';
  element.href = blobURL;
  element.setAttribute('download', filename);

  if (typeof element.download === 'undefined') {
    element.setAttribute('target', '_blank');
  }

  document.body.appendChild(element);
  element.click();

  // 0.2초 뒤에 요소 삭제
  setTimeout(function () {
    document.body.removeChild(element);
    window.URL.revokeObjectURL(blobURL);
  }, 200);
}

export default async (url) => {
  try {
    const res = await api({
      url: url,
      method: 'get',
      responseType: 'blob',
    });

    const {headers, data} = res;
    const content = headers['content-disposition'] || '';
    let file = ''
    content.split(`;`).forEach((param) => {
      const [name, ...rest] = param.split(`=`)
      if (name.trim() == 'filename') {
        file = decodeURI(rest.join(`=`).replaceAll('"', '').trim())
      }
    })

    if (file != '') {
      download(data, file, headers['content-type']);
      return Promise.resolve({data: file});
    } else {
      return Promise.reject(new Error('Error file'));
    }
    // const attrs = /(\w+)=([^\s]+)/.exec(content) || [];
    // const [, , name = ''] = attrs;
    // if (!!name) {
    //   const filename = decodeURI(content.replace(/['"\\]/g, ''));
    //   download(data, filename, headers['content-type']);
    //   return Promise.resolve({ data: filename });
    // } else {
    //   return Promise.reject(new Error('Error file'));
    // }
  } catch (e) {
    if (e.response.status == 400) {
      return Promise.reject({...e, message: '파일이 없습니다.'});
    }
  }
};
