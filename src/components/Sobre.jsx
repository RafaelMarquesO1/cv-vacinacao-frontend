import '../styles/styles.css';
import '../styles/Sobre.css';  // Importando o CSS específico para a página

function Sobre() {
    return (
        <div className='container-base'>
            <h1>Sobre o Vacinici</h1>
            <p>Esta é a página de administração do aplicativo Vacinici, onde você pode gerenciar:</p>
            <ul>
                <li>Cadastro de Funcionários</li>
                <li>Cadastro de Campanhas de Vacinação</li>
                <li>Cadastro de Vacinas</li>
                <li>Cadastro de Pacientes</li>
            </ul>
            <p>O aplicativo foi desenvolvido para facilitar a gestão de vacinação, proporcionando uma experiência simples e eficiente.</p>
        </div>
    );
}

export default Sobre;
