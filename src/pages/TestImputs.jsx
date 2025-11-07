// Crea un archivo temporal: pages/TestInputs.jsx
import React from 'react';

const TestInputs = () => {
  return (
    <div style={{padding: '20px'}}>
      <h1>🔍 TEST DE INPUTS</h1>
      
      <div style={{margin: '20px 0'}}>
        <h3>Input con value:</h3>
        <input type="text" value="Valor con value" />
      </div>

      <div style={{margin: '20px 0'}}>
        <h3>Input con defaultValue:</h3>
        <input type="text" defaultValue="Valor con defaultValue" />
      </div>

      <div style={{margin: '20px 0'}}>
        <h3>Input normal:</h3>
        <input type="text" placeholder="Escribe aquí..." />
      </div>
    </div>
  );
};

export default TestInputs;