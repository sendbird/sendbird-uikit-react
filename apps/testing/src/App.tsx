import { App } from '../../../src';

export default function TestingApp() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <App appId={import.meta.env.VITE_APP_ID} userId={'test'} />
    </div>
  );
}
