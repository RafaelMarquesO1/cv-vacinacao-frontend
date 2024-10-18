import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import '../styles/styles.css'

class Vacinas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      nomeVacina: "",
      lote: "",
      vacStatus: "",
      vacinas: [],
      modalAberto: false,
    };
  }

  componentDidMount() {
    this.buscarVacinas();
  }

  buscarVacinas = () => {
    fetch("http://localhost:8080/api/vacinas")
      .then((res) => res.json())
      .then((dados) => this.setState({ vacinas: dados }))
      .catch((error) => console.error("Erro ao buscar vacinas:", error));
  };

  deletarVacina = (id) => {
    fetch(`http://localhost:8080/api/vacinas/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) this.buscarVacinas();
        else alert("Não foi possível deletar a vacina!");
      })
      .catch((error) => console.error("Erro ao deletar vacina:", error));
  };

  carregarDados = (id) => {
    fetch(`http://localhost:8080/api/vacinas/${id}`)
      .then((res) => res.json())
      .then((vacina) => {
        this.setState({
          id: vacina.id,
          nomeVacina: vacina.nomeVacina,
          lote: vacina.lote,
          vacStatus: vacina.vacStatus,
        });
        this.abrirModal();
      })
      .catch((error) => console.error("Erro ao carregar dados da vacina:", error));
  };

  cadastrarVacina = (vacina) => {
    fetch("http://localhost:8080/api/vacinas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vacina),
    })
      .then((res) => {
        if (res.ok) {
          this.buscarVacinas();
          this.limparFormulario();
          this.fecharModal();
        } else alert("Não foi possível cadastrar a vacina!");
      })
      .catch((error) => console.error("Erro ao cadastrar vacina:", error));
  };

  atualizarVacina = (vacina) => {
    fetch(`http://localhost:8080/api/vacinas/${vacina.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vacina),
    })
      .then((res) => {
        if (res.ok) {
          this.buscarVacinas();
          this.limparFormulario();
          this.fecharModal();
        } else alert("Não foi possível atualizar a vacina!");
      })
      .catch((error) => console.error("Erro ao atualizar vacina:", error));
  };

  limparFormulario = () => {
    this.setState({
      id: 0,
      nomeVacina: "",
      lote: "",
      vacStatus: "",
    });
  };

  abrirModal = () => this.setState({ modalAberto: true });

  fecharModal = () => this.setState({ modalAberto: false });

  handleSubmit = (e) => {
    e.preventDefault();
    const vacina = {
      id: this.state.id,
      nomeVacina: this.state.nomeVacina,
      lote: this.state.lote,
      vacStatus: this.state.vacStatus,
    };
    if (this.state.id === 0) {
      this.cadastrarVacina(vacina);
    } else {
      this.atualizarVacina(vacina);
    }
  };

  renderTabela = () => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nome da Vacina</th>
          <th>Lote</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {this.state.vacinas.map((vacina) => (
          <tr key={vacina.id}>
            <td>{vacina.nomeVacina}</td>
            <td>{vacina.lote}</td>
            <td>{vacina.vacStatus}</td>
            <td>
              <Button
                variant="secondary"
                onClick={() => this.carregarDados(vacina.id)}
                className="me-2"
              >
                Atualizar
              </Button>
              <Button
                variant="danger"
                onClick={() => this.deletarVacina(vacina.id)}
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
            <Modal.Title>Dados da Vacina</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3" controlId="formNomeVacina">
                <Form.Label>Nome da Vacina</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.nomeVacina}
                  onChange={(e) => this.setState({ nomeVacina: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLote">
                <Form.Label>Lote</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.lote}
                  onChange={(e) => this.setState({ lote: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formVacStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.vacStatus}
                  onChange={(e) => this.setState({ vacStatus: e.target.value })}
                  placeholder="ATIVO / INATIVO"
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
            this.limparFormulario();
            this.abrirModal();
          }}
          className="mb-3"
        >
          Nova Vacina
        </Button>

        {this.renderTabela()}
      </div>
    );
  }
}

export default Vacinas;