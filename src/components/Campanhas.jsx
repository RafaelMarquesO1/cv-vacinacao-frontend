import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import '../styles/styles.css'

class Campanhas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      nomeCampanha: "",
      descricao: "",
      dataInicio: "",
      dataFim: "",
      campanhas: [],
      modalAberto: false,
    };
  }

  componentDidMount() {
    this.buscarCampanhas();
  }

  buscarCampanhas = () => {
    fetch("http://localhost:8080/api/campanhas")
      .then((resposta) => resposta.json())
      .then((dados) => {
        this.setState({ campanhas: dados });
      })
      .catch((error) => {
        console.error("Erro ao buscar campanhas:", error);
      });
  };

  formatarData = (dataISO) => {
    if (!dataISO) return "Data inválida"; // Verifica se é nulo ou indefinido
    const data = new Date(dataISO);
    if (isNaN(data)) return "Data inválida"; // Verifica se é uma data válida

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Mês começa em 0
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`; // Formato dd/mm/yyyy
  };

  deletarCampanha = (id) => {
    fetch(`http://localhost:8080/api/campanhas/${id}`, {
      method: "DELETE",
    })
      .then((resposta) => {
        if (resposta.ok) {
          this.buscarCampanhas();
        } else {
          alert("Não foi possível deletar a campanha!");
        }
      })
      .catch((error) => {
        console.error("Erro ao deletar campanha:", error);
      });
  };

  carregarDados = (id) => {
    fetch(`http://localhost:8080/api/campanhas/${id}`, {
      method: "GET",
    })
      .then((resposta) => resposta.json())
      .then((campanha) => {
        if (campanha) {
          this.setState({
            id: campanha.id,
            nomeCampanha: campanha.nomeCampanha,
            descricao: campanha.descricao,
            dataInicio: campanha.dataInicio,
            dataFim: campanha.dataFim,
          });
          this.abrirModal();
        } else {
          alert("Campanha não encontrada!");
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar dados da campanha:", error);
      });
  };

  cadastraCampanha = (campanha) => {
    fetch("http://localhost:8080/api/campanhas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campanha),
    })
      .then((resposta) => {
        if (resposta.ok) {
          this.buscarCampanhas();
          this.limparFormulario();
          this.fecharModal();
        } else {
          alert("Não foi possível cadastrar a campanha!");
        }
      })
      .catch((error) => {
        console.error("Erro ao cadastrar campanha:", error);
      });
  };

  atualizarCampanha = (campanha) => {
    fetch(`http://localhost:8080/api/campanhas/${campanha.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campanha),
    })
      .then((resposta) => {
        if (resposta.ok) {
          this.buscarCampanhas();
          this.limparFormulario();
          this.fecharModal();
        } else {
          alert("Não foi possível atualizar a campanha!");
        }
      })
      .catch((error) => {
        console.error("Erro ao atualizar campanha:", error);
      });
  };

  limparFormulario = () => {
    this.setState({
      id: 0,
      nomeCampanha: "",
      descricao: "",
      dataInicio: "",
      dataFim: "",
    });
  };

  fecharModal = () => {
    this.setState({ modalAberto: false });
  };

  abrirModal = () => {
    this.setState({ modalAberto: true });
  };

  atualizaNomeCampanha = (e) => {
    this.setState({ nomeCampanha: e.target.value });
  };

  atualizaDescricao = (e) => {
    this.setState({ descricao: e.target.value });
  };

  atualizaDataInicio = (e) => {
    this.setState({ dataInicio: e.target.value });
  };

  atualizaDataFim = (e) => {
    this.setState({ dataFim: e.target.value });
  };

  submit = (e) => {
    e.preventDefault();
    const campanha = {
      id: this.state.id,
      nomeCampanha: this.state.nomeCampanha,
      descricao: this.state.descricao,
      dataInicio: this.state.dataInicio,
      dataFim: this.state.dataFim,
    };

    if (this.state.id === 0) {
      this.cadastraCampanha(campanha);
    } else {
      this.atualizarCampanha(campanha);
    }
  };

  renderTabela = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome da Campanha</th>
            <th>Descrição</th>
            <th>Data de Início</th>
            <th>Data de Fim</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {this.state.campanhas.map((campanha) => (
            <tr key={campanha.id}>
              <td>{campanha.nomeCampanha}</td>
              <td style={{ whiteSpace: "normal" }}>{campanha.descricao}</td>
              <td>{this.formatarData(campanha.dataInicio)}</td>
              <td>{this.formatarData(campanha.dataFim)}</td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => this.carregarDados(campanha.id)}
                  className="me-2"
                >
                  Atualizar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => this.deletarCampanha(campanha.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  render() {
    return (
      <div>
        <Modal show={this.state.modalAberto} onHide={this.fecharModal}>
          <Modal.Header closeButton>
            <Modal.Title>DADOS DA CAMPANHA</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.submit}>
              <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" value={this.state.id} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nome da Campanha</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.nomeCampanha}
                  onChange={this.atualizaNomeCampanha}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={this.state.descricao}
                  onChange={this.atualizaDescricao}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Data de Início</Form.Label>
                <Form.Control
                  type="date"
                  value={this.state.dataInicio}
                  onChange={this.atualizaDataInicio}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Data de Fim</Form.Label>
                <Form.Control
                  type="date"
                  value={this.state.dataFim}
                  onChange={this.atualizaDataFim}
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
          className="ms-2"
        >
          Nova Campanha
        </Button>

        {this.renderTabela()}
      </div>
    );
  }
}

export default Campanhas;