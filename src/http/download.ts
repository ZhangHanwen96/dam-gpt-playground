import axios from '.'

axios
  .get(
    'https://tezign-assets-test.tezign.com/6d708379a8ceceda0043ae92ef58f1df.dotx?Expires=2314108799&OSSAccessKeyId=LTAI5tDubGKMRMroG8MuTLZo&Signature=e3H712YpYYox9R9F2SVAGWRlg%2BM%3D&response-content-disposition=attachment%3B%20filename%3D%22dotx%25E6%2596%2587%25E6%25A1%25A3-1dotx%25E6%2596%2587%25E6%25A1%25A3.dotx%22%3B%20filename%2A%3Dutf-8%27%27dotx%25E6%2596%2587%25E6%25A1%25A3-1dotx%25E6%2596%2587%25E6%25A1%25A3.dotx&response-content-type=application%2Foctet-stream',
    {
      responseType: 'blob'
    }
  )
  .then((response) => {
    const filename =
      response.headers['content-disposition'].split('filename=')[1]
    const blob = new Blob([response.data])
    const newFile = new File([blob], filename, {
      type: 'application/octet-stream'
    })
  })
