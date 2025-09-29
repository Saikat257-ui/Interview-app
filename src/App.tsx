// import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider, Spin } from 'antd';
import { store, persistor } from './store';
import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
            },
          }}
        >
          <Router>
            <MainLayout />
          </Router>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
