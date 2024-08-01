import React from 'react';
import ProviderTable from '../CRUDS/crudgasto';
import MyChart from '../componentes/Grafica_gasto';


const App = () => {
  return (
    <div className="min-w-screen min-h-screen bg-white flex flex-col items-center">
       
        <div className="w-full max-w-4xl mt-8">
        <ProviderTable />
        {/* <MyChart /> */}
      </div>
    </div>
  );
};

export default App;
