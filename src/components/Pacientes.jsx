import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import '../styles/styles.css'

class Pacientes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      nome: '',
      telefone: '',
      genero: '',
      dataNasc: '',
      endereco: '',
      cpf: '',
      pacientes: [],
      modalAberto: false,
    };
  }

  componentDidMount() {
    this.buscarPacientes();
  }

  buscarPacientes = () => {
    fetch("http://localhost:8080/api/pacientes")
      .then((res) => res.json())
      .then((dados) => this.setState({ pacientes: dados }))
      .catch((error) => console.error("Erro ao buscar pacientes:", error));
  };

  deletarPaciente = (id) => {
    fetch(`http://localhost:8080/api/pacientes/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) this.buscarPacientes();
        else alert("Não foi possível deletar o paciente!");
      })
      .catch((error) => console.error("Erro ao deletar paciente:", error));
  };

  carregarDados = (id) => {
    fetch(`http://localhost:8080/api/pacientes/${id}`)
      .then((res) => res.json())
      .then((paciente) => {
        this.setState({
          id: paciente.id,
          nome: paciente.nome,
          telefone: paciente.telefone || '',
          genero: paciente.genero || '',
          dataNasc: paciente.dataNasc || '',
          endereco: paciente.endereco || '',
          cpf: paciente.cpf,
        });
        this.abrirModal();
      })
      .catch((error) => console.error("Erro ao carregar dados do paciente:", error));
  };

  cadastrarPaciente = (paciente) => {
    fetch("http://localhost:8080/api/pacientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paciente),
    })
      .then((res) => {
        if (res.ok) {
          this.buscarPacientes();
          this.limparFormulario();
          this.fecharModal();
        } else alert("Não foi possível cadastrar o paciente!");
      })
      .catch((error) => console.error("Erro ao cadastrar paciente:", error));
  };

  atualizarPaciente = (paciente) => {
    fetch(`http://localhost:8080/api/pacientes/${paciente.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paciente),
    })
      .then((res) => {
        if (res.ok) {
          this.buscarPacientes();
          this.limparFormulario();
          this.fecharModal();
        } else alert("Não foi possível atualizar o paciente!");
      })
      .catch((error) => console.error("Erro ao atualizar paciente:", error));
  };

  limparFormulario = () => {
    this.setState({
      id: 0,
      nome: '',
      telefone: '',
      genero: '',
      dataNasc: '',
      endereco: '',
      cpf: '',
    });
  };

  abrirModal = () => this.setState({ modalAberto: true });

  fecharModal = () => this.setState({ modalAberto: false });

  handleSubmit = (e) => {
    e.preventDefault();
    const paciente = {
      id: this.state.id,
      nome: this.state.nome,
      telefone: this.state.telefone,
      genero: this.state.genero,
      dataNasc: this.state.dataNasc,
      endereco: this.state.endereco,
      cpf: this.state.cpf,
    };
    if (this.state.id === 0) {
      this.cadastrarPaciente(paciente);
    } else {
      this.atualizarPaciente(paciente);
    }
  };

  renderTabela = () => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Gênero</th>
          <th>Data de Nascimento</th>
          <th>Endereço</th>
          <th>CPF</th>
          <th>Opções</th>
        </tr>
      </thead>
      <tbody>
        {this.state.pacientes.map((paciente) => (
          <tr key={paciente.id}>
            <td>{paciente.nome}</td>
            <td>{paciente.telefone}</td>
            <td>{paciente.genero}</td>
            <td>{paciente.dataNasc}</td>
            <td>{paciente.endereco}</td>
            <td>{paciente.cpf}</td>
            <td>
              <Button
                variant="secondary"
                onClick={() => this.carregarDados(paciente.id)}
                className="me-2"
              >
                Atualizar
              </Button>
              <Button
                variant="danger"
                onClick={() => this.deletarPaciente(paciente.id)}
              >
                Excluir
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  render() {
    return (
      <div>
        <Modal show={this.state.modalAberto} onHide={this.fecharModal}>
          <Modal.Header closeButton>
            <Modal.Title>Dados do Paciente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3" controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.nome}
                  onChange={(e) => this.setState({ nome: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formTelefone">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.telefone}
                  onChange={(e) => this.setState({ telefone: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGenero">
                <Form.Label>Gênero</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.genero}
                  onChange={(e) => this.setState({ genero: e.target.value })}
                  placeholder="M / F / O"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDataNasc">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  value={this.state.dataNasc}
                  onChange={(e) => this.setState({ dataNasc: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEndereco">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.endereco}
                  onChange={(e) => this.setState({ endereco: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCPF">
                <Form.Label>CPF</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.cpf}
                  onChange={(e) => this.setState({ cpf: e.target.value })}
                  required
                />
              </Form.Group>

              <Modal.Footer>
                <Button variant="secondary" onClick={this.fecharModal}>
                  Fechar
                </Button>
                <Button variant="primary" type="submit">
                  Salvar
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        <Button
          variant="warning"
          onClick={() => {
            this.limparFormulario(); // Limpa o formulário
            this.abrirModal(); // Abre o modal
          }}
          className="mb-3"
        >
          Novo Paciente
        </Button>

        {this.renderTabela()}
      </div>
    );
  }
}

export default Pacientes;
