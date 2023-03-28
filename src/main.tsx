import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
//////////// Debug function TODO remove on production

if(navigator.storage && navigator.storage.estimate) {
    const quota =  navigator.storage.estimate()
    quota.then((res: any)=>{
        const percentageUsed = (res.usage / res.quota) * 100
        console.log(`Вы использовали ${ percentageUsed}% хранилища`)
        const remaining = res.quota - res.usage
        console.log(`Вам доступно еще ${remaining} байт`)
    })

}
//////////// Debug function

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
