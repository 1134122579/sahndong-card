const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().map(fileName => modulesFiles(fileName).default || modulesFiles(fileName));
const api = modules.reduce((prev, curr) => Object.assign(prev, curr), {});
console.log('整合所有接口', api)
export default api
