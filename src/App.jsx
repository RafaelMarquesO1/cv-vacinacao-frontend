import 'bootstrap/dist/css/bootstrap.min.css';
import Funcionarios from './components/Funcionarios';
import Home from './components/Home';
import Sobre from './components/Sobre';
import Pacientes from './components/Pacientes';
import Vacinas from './components/Vacinas';
import Campanhas from './components/Campanhas'; // Importe o componente Campanhas
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useState } from 'react';
import './styles/styles.css';

function App() {
  const [activeTab, setActiveTab] = useState('/'); // Define a aba ativa como a rota inicial
  const navigate = useNavigate();

  // Função para mudar a rota e a aba ao mesmo tempo
  const handleSelect = (key) => {
    setActiveTab(key);  // Atualiza a aba ativa
    navigate(key);      // Navega para a rota correspondente
  };

  return (
    <div className='App'>
      <h1>Tela de Administração - Vacinici</h1>

      <Tabs
        activeKey={activeTab}      // Define a aba ativa
        onSelect={handleSelect}    // Função que trata a mudança de aba
        className="mb-3"
      >
        <Tab eventKey="/" title="Home" />
        <Tab eventKey="/funcionarios" title="Cadastro de Funcionários" />
        <Tab eventKey="/pacientes" title="Pacientes" />
        <Tab eventKey="/vacinas" title="Vacinas" />
        <Tab eventKey="/campanhas" title="Campanhas" />
        <Tab eventKey="/sobre" title="Sobre" />
      </Tabs>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/vacinas" element={<Vacinas />} />
        <Route path="/campanhas" element={<Campanhas />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </div>
  );
}

export default App;
