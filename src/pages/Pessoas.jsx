import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import pessoasService from '../services/pessoasService';
import cargosService from '../services/cargosService';
import departamentosService from '../services/departamentosService';
import { formatarData } from '../utils/formatters';
import { phoneMask, validatePhone } from '../utils/masks';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
const LOCAL_STORAGE_KEY = 'formulario_pessoa_cache';

const Pessoas = () => {
  const { hasPermission } = useAuth();
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [carregandoCep, setCarregandoCep] = useState(false);

  const [filtros, setFiltros] = useState({
    busca: '',
    cargo_id: '',
    departamento_id: '',
    ativo: ''
  });

  const [paginacao, setPaginacao] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [pessoaEditando, setPessoaEditando] = useState(null);
  const [dadosFormulario, setDadosFormulario] = useState({
    nome_completo: '',
    telefone: '',
    email: '',
    data_nascimento: '',
    cep: '',
    endereco: '',
    cargo_eclesiastico_id: '',
    departamento_id: '',
    ativo: true
  });

  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    carregarPessoas();
    carregarDadosAuxiliares();
  }, [filtros, paginacao.page]);

  const carregarPessoas = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        ...filtros,
        page: paginacao.page,
        limit: paginacao.limit
      };

      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await pessoasService.listar(params);
      console.log('Pessoas', response);
      if (response) {
        setPessoas(response.pessoas);
        setPaginacao(prev => ({
          ...prev,
          total: response.total,
          totalPages: response.totalPages
        }));
      }
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar pessoas:', err);
      setError(err?.message || 'Erro ao carregar pessoas');
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosAuxiliares = async () => {
    try {
      const responseCargos = await cargosService.listar();
      console.log("CArgos", responseCargos);
      if (responseCargos) {
        setCargos(responseCargos);
      }

      const responseDepartamentos = await departamentosService.listar();
      console.log("Departamentos", responseDepartamentos);
      if (responseDepartamentos) {
        setDepartamentos(responseDepartamentos);
      }
    } catch (err) {
      console.error('Erro ao carregar dados auxiliares:', err);
      setCargos([
        { id: 1, nome: 'Pastor' },
        { id: 2, nome: 'Presbítero' },
        { id: 3, nome: 'Diácono' },
        { id: 4, nome: 'Membro' }
      ]);

      setDepartamentos([
        { id: 1, nome: 'Louvor' },
        { id: 2, nome: 'Ensino' },
        { id: 3, nome: 'Evangelismo' },
        { id: 4, nome: 'Recepção' }
      ]);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
    setPaginacao(prev => ({ ...prev, page: 1 }));
  };

  const limparFiltros = () => {
    setFiltros({
      busca: '',
      cargo_id: '',
      departamento_id: '',
      ativo: ''
    });
    setPaginacao(prev => ({ ...prev, page: 1 }));
  };

const abrirModal = (pessoa = null) => {
  if (pessoa) {
    setPessoaEditando(pessoa);
    setDadosFormulario({
      nome_completo: pessoa.nome_completo || '',
      telefone: pessoa.telefone || '',
      email: pessoa.email || '',
      data_nascimento: pessoa.data_nascimento || '',
      cep: '',
      endereco: pessoa.endereco || '',
      cargo_eclesiastico_id: pessoa.cargo_eclesiastico_id || '',
      departamento_id: pessoa.departamento_id || '',
      ativo: pessoa.ativo !== undefined ? pessoa.ativo : true
    });
  } else {
    const cache = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cache) {
      setDadosFormulario(JSON.parse(cache));
    } else {
      setDadosFormulario({
        nome_completo: '',
        telefone: '',
        email: '',
        data_nascimento: '',
        cep: '',
        endereco: '',
        cargo_eclesiastico_id: '',
        departamento_id: '',
        ativo: true
      });
    }
    setPessoaEditando(null);
  }
  setModalAberto(true);
};

  const fecharModal = () => {
    setModalAberto(false);
    setPessoaEditando(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const { cep, ...dados } = dadosFormulario;

      if(!dados.departamento_id){
        setError('O campo departamento é obrigatório');
        return;
      }
      if(!dados.cargo_eclesiastico_id){
        setError('O campo cargo é obrigatório');
        return;
      }      

      if (pessoaEditando) {
        const response = await pessoasService.atualizar(pessoaEditando.id, dados);
        if (response) {
          setSuccess('Pessoa atualizada com sucesso!');
          carregarPessoas();
          fecharModal();
        }
      } else {
        const response = await pessoasService.criar(dados);
        console.log('Criar pessoa', response);
        if (response) {
          setSuccess('Pessoa criada com sucesso!');
          carregarPessoas();
          fecharModal();
        }
      }
      setError(null)
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      console.error('Erro ao salvar pessoa:', err);
      setError(err.response?.data?.error || 'Erro ao salvar pessoa');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta pessoa?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await pessoasService.excluir(id);
      
      if (response.success) {
        setSuccess('Pessoa excluída com sucesso!');
        carregarPessoas();
      }
    } catch (err) {
      console.error('Erro ao excluir pessoa:', err);
      setError(err.response?.data?.error || 'Erro ao excluir pessoa');
    } finally {
      setLoading(false);
    }
  };

const handleInputChange = (campo, valor) => {
  const novosDados = {
    ...dadosFormulario,
    [campo]: valor
  };

  setDadosFormulario(novosDados);

  if (!pessoaEditando) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(novosDados));
  }
};

  if (loading && pessoas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const buscarEnderecoPorCep = async () => {
  if (!dadosFormulario.cep || dadosFormulario.cep.length < 8) {
    setError('Informe um CEP válido com 8 dígitos.');
    return;
  }

  try {
    setCarregandoCep(true);
    setError('');
    const response = await fetch(`https://viacep.com.br/ws/${dadosFormulario.cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      setError('CEP não encontrado.');
      return;
    }

    const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
    setDadosFormulario(prev => ({
      ...prev,
      endereco: enderecoCompleto
    }));
  } catch (err) {
    setError('Erro ao buscar endereço. Tente novamente.');
  } finally {
    setCarregandoCep(false);
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pessoas</h1>
          <p className="text-gray-600 mt-2">
            Gerenciar membros e participantes da igreja
          </p>
        </div>
        
        {hasPermission('pessoas_create') && (
          <Dialog open={modalAberto} onOpenChange={setModalAberto}>
            <DialogTrigger asChild>
              <Button onClick={() => abrirModal()} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Nova Pessoa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {pessoaEditando ? 'Editar Pessoa' : 'Nova Pessoa'}
                </DialogTitle>
                <DialogDescription>
                  {pessoaEditando 
                    ? 'Atualize as informações da pessoa.' 
                    : 'Preencha os dados para cadastrar uma nova pessoa.'
                  }
                </DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome_completo">Nome Completo *</Label>
                    <Input
                      id="nome_completo"
                      value={dadosFormulario.nome_completo}
                      onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={dadosFormulario.telefone}
                      onChange={(e) => {
                        const maskedValue = phoneMask(e.target.value);
                        handleInputChange('telefone', maskedValue);
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={dadosFormulario.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                    <Input
                      id="data_nascimento"
                      type="date"
                      value={dadosFormulario.data_nascimento}
                      onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cargo_eclesiastico_id">Cargo Eclesiástico *</Label>
                    <Select
                      value={dadosFormulario.cargo_eclesiastico_id?.toString() || ''}
                      onValueChange={(value) => handleInputChange('cargo_eclesiastico_id', value ? parseInt(value) : '')} required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem>Nenhum cargo</SelectItem>
                        {cargos.map(cargo => (
                          <SelectItem key={cargo.id} value={cargo.id.toString()}>
                            {cargo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="departamento_id">Departamento *</Label>
                    <Select
                      value={dadosFormulario.departamento_id?.toString() || ''}
                      onValueChange={(value) => handleInputChange('departamento_id', value ? parseInt(value) : '')} required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                      <SelectContent required>
                        <SelectItem>Nenhum departamento</SelectItem>
                        {departamentos.map(dept => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={dadosFormulario.cep}
                      onChange={(e) => handleInputChange('cep', e.target.value.replace(/\D/g, '').slice(0, 8))}
                      placeholder="Digite o CEP"
                    />
                  </div>

                  <div className="md:col-span-1 flex items-end">
                    <Button
                      type="button"
                      onClick={buscarEnderecoPorCep}
                      disabled={carregandoCep || dadosFormulario.cep.length < 8}
                      className="w-full"
                    >
                      {carregandoCep ? 'Buscando...' : 'Buscar Endereço'}
                    </Button>
                  </div>

                  <div className="md:col-span-3">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={dadosFormulario.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      placeholder="Rua, número, complemento..."
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={dadosFormulario.ativo}
                    onChange={(e) => handleInputChange('ativo', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="ativo">Pessoa ativa</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={fecharModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                    {loading ? 'Salvando...' : pessoaEditando ? 'Atualizar' : 'Criar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="busca">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="busca"
                  placeholder="Nome, telefone ou email..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cargo_filtro">Cargo</Label>
              <Select
                value={filtros.cargo_id}
                onValueChange={(value) => handleFiltroChange('cargo_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os cargos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem >Todos os cargos</SelectItem>
                  {cargos.map(cargo => (
                    <SelectItem key={cargo.id} value={cargo.id.toString()}>
                      {cargo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="departamento_filtro">Departamento</Label>
              <Select
                value={filtros.departamento_id}
                onValueChange={(value) => handleFiltroChange('departamento_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem >Todos os departamentos</SelectItem>
                  {departamentos.map(dept => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ativo_filtro">Status</Label>
              <Select
                value={filtros.ativo}
                onValueChange={(value) => handleFiltroChange('ativo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem>Todos</SelectItem>
                  <SelectItem value="true">Ativos</SelectItem>
                  <SelectItem value="false">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={limparFiltros}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pessoas ({paginacao.total})
          </CardTitle>
          <CardDescription>
            Lista de todas as pessoas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pessoas.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma pessoa encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pessoas.map((pessoa) => (
                    <TableRow key={pessoa.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{pessoa.nome_completo}</div>
                          {pessoa.data_nascimento && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatarData(pessoa.data_nascimento)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {pessoa.telefone}
                          </div>
                          {pessoa.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="h-3 w-3" />
                              {pessoa.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {pessoa.cargoEclesiastico?.nome || '-'}
                      </TableCell>
                      <TableCell>
                        {pessoa.departamento?.nome || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pessoa.ativo ? 'default' : 'secondary'}>
                          {pessoa.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {hasPermission('pessoas_update') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => abrirModal(pessoa)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {hasPermission('pessoas_delete') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExcluir(pessoa.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {paginacao.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Mostrando {((paginacao.page - 1) * paginacao.limit) + 1} a{' '}
                {Math.min(paginacao.page * paginacao.limit, paginacao.total)} de{' '}
                {paginacao.total} pessoas
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginacao(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={paginacao.page === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {paginacao.page} de {paginacao.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginacao(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={paginacao.page === paginacao.totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Pessoas;

