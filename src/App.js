import React from 'react';
import Store from './store/store';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import InformationModal from './components/infoModal';

const App = () => (
  <div>
    <InformationModal />
    <Store>
      <App />
    </Store>
  </div>
);

export default App;