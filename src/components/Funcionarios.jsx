import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from 'react-bootstrap/Modal';
import '../styles/styles.css'

class Funcionarios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      nome: '',
      email: '',
      senha: '',
      funcionarios: [],
      modalAberto: false
    };
  }

  componentDidMount() {
    this.buscarFuncionario();
  }

  buscarFuncionario = () => {
    fetch("http://localhost:8080/api/funcionarios")
      .then((resposta) => resposta.json())
      .then((dados) => {
        this.setState({ funcionarios: dados });
      })
      .catch((error) => {
        console.error("Erro ao buscar funcionários:", error);
      });
  };

  deletarFuncionario = (id) => {
    fetch(`http://localhost:8080/api/funcionarios/${id}`, {
      method: "DELETE",
    })
      .then((resposta) => {
        if (resposta.ok) {
          this.buscarFuncionario();
        } else {
          alert('Não foi possível deletar o funcionário!');
        }
      })
      .catch((error) => {
        console.error("Erro ao deletar funcionário:", error);
      });
  };

  carregarDados = (id) => {
    fetch(`http://localhost:8080/api/funcionarios/${id}`, {
      method: "GET",
    })
      .then((resposta) => resposta.json())
      .then((funcionario) => {
        if (funcionario) {
          this.setState({
            id: funcionario.id,
            nome: funcionario.nome,
            email: funcionario.email,
            senha: funcionario.senha,
          });
          this.abrirModal();
        } else {
          alert('Funcionário não encontrado!');
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar dados do funcionário:", error);
      });
  };

  cadastraFuncionario = (funcionario) => {
    fetch("http://localhost:8080/api/funcionarios", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(funcionario),
    })
      .then((resposta) => {
        if (resposta.ok) {
          this.buscarFuncionario();
          this.limparFormulario();
          this.fecharModal();
        } else {
          alert('Não foi possível cadastrar o funcionário!');
        }
      })
      .catch((error) => {
        console.error("Erro ao cadastrar funcionário:", error);
      });
  };

  atualizarFuncionario = (funcionario) => {
    fetch(`http://localhost:8080/api/funcionarios/${funcionario.id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(funcionario),
    })
      .then((resposta) => {
        if (resposta.ok) {
          this.buscarFuncionario();
          this.limparFormulario();
          this.fecharModal();
        } else {
          alert('Não foi possível atualizar os dados do funcionário!');
        }
      })
      .catch((error) => {
        console.error("Erro ao atualizar funcionário:", error);
      });
  };

  limparFormulario = () => {
    this.setState({
      id: 0,
      nome: '',
      email: '',
      senha: '',
    });
  };

  fecharModal = () => {
    this.setState({ modalAberto: false });
  };

  abrirModal = () => {
    this.setState({ modalAberto: true });
  };

  atualizaNome = (e) => {
    this.setState({ nome: e.target.value });
  };

  atualizaEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  atualizaSenha = (e) => {
    this.setState({ senha: e.target.value });
  };

  submit = (e) => {
    e.preventDefault();
    const funcionario = {
      id: this.state.id,
      nome: this.state.nome,
      email: this.state.email,
      senha: this.state.senha,
    };

    if (this.state.id === 0) {
      this.cadastraFuncionario(funcionario);
    } else {
      this.atualizarFuncionario(funcionario);
    }
  };

  renderTabela = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr><th>Nome</th><th>Email</th><th>Senha</th><th>Opções</th></tr>
        </thead>
        <tbody>
          {this.state.funcionarios.map((funcionario) => (
            <tr key={funcionario.id}>
              <td>{funcionario.nome}</td>
              <td>{funcionario.email}</td>
              <td>{funcionario.senha}</td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => this.carregarDados(funcionario.id)}
                  className="me-2"
                >
                  Atualizar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => this.deletarFuncionario(funcionario.id)}
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
            <Modal.Title>DADOS DO FUNCIONÁRIO</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.submit}>
              <Form.Group className="mb-3" controlId="formBasicId">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" value={this.state.id} readOnly />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome..."
                  value={this.state.nome}
                  onChange={this.atualizaNome}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite o e-mail..."
                  value={this.state.email}
                  onChange={this.atualizaEmail}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite a senha..."
                  value={this.state.senha}
                  onChange={this.atualizaSenha}
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

        <Button variant="warning" onClick={() => { this.limparFormulario(); this.abrirModal(); }} className="ms-2">
          Novo
        </Button>

        {this.renderTabela()}
      </div>
    );
  }
}

export default Funcionarios;