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
import usuariosService from '../services/usuariosService';
import perfisService from '../services/perfisService';
import pessoasService from '../services/pessoasService';
import { formatarData } from '../utils/formatters';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Key,
  Shield,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  UserCheck,
  UserX
} from 'lucide-react';

const Usuarios = () => {
  const { hasPermission } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [filtros, setFiltros] = useState({
    busca: '',
    perfil_id: '',
    ativo: '',
    email_verificado: ''
  });

  const [paginacao, setPaginacao] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [dadosFormulario, setDadosFormulario] = useState({
    email: '',
    senha: '',
    perfil_id: '',
    pessoa_id: '',
    ativo: true,
    email_verificado: false
  });

  const [dadosSenha, setDadosSenha] = useState({
    senha_atual: '',
    nova_senha: '',
    confirmar_senha: ''
  });

  const [perfis, setPerfis] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    carregarUsuarios();
    carregarDadosAuxiliares();
  }, [filtros, paginacao.page]);

  const carregarUsuarios = async () => {
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

      const response = await usuariosService.listar(params);

      if (response) {
        setUsuarios(response.usuarios);
        setPaginacao(prev => ({
          ...prev,
          total: response.total,
          totalPages: response.totalPages
        }));
      }
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosAuxiliares = async () => {
    try {
      const responsePerfis = await perfisService.listarTodos();
      console.log('Perfis', responsePerfis);
      if (responsePerfis) {
        setPerfis(responsePerfis);
      }

      const responsePessoas = await pessoasService.listar({ limit: 100 });
      if (responsePessoas) {
        setPessoas(responsePessoas.pessoas || []);
      }
    } catch (err) {
      console.error('Erro ao carregar dados auxiliares:', err);
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
      perfil_id: '',
      ativo: '',
      email_verificado: ''
    });
    setPaginacao(prev => ({ ...prev, page: 1 }));
  };

  const abrirModal = (usuario = null) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      setDadosFormulario({
        email: usuario.email || '',
        senha: '',
        perfil_id: usuario.perfil_id || '',
        pessoa_id: usuario.pessoa_id || '',
        ativo: usuario.ativo !== undefined ? usuario.ativo : true,
        email_verificado: usuario.email_verificado !== undefined ? usuario.email_verificado : false
      });
    } else {
      setUsuarioEditando(null);
      setDadosFormulario({
        email: '',
        senha: '',
        perfil_id: '',
        pessoa_id: '',
        ativo: true,
        email_verificado: false
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setUsuarioEditando(null);
    setError('');
    setSuccess('');
  };

  const abrirModalSenha = (usuario) => {
    setUsuarioEditando(usuario);
    setDadosSenha({
      senha_atual: '',
      nova_senha: '',
      confirmar_senha: ''
    });
    setModalSenhaAberto(true);
  };

  const fecharModalSenha = () => {
    setModalSenhaAberto(false);
    setUsuarioEditando(null);
    setDadosSenha({
      senha_atual: '',
      nova_senha: '',
      confirmar_senha: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      if (usuarioEditando) {
        const response = await usuariosService.atualizar(usuarioEditando.id, dadosFormulario);
        if (response) {
          setSuccess('Usuário atualizado com sucesso!');
          carregarUsuarios();
          fecharModal();
        }
      } else {
        const response = await usuariosService.criar(dadosFormulario);
        if (response) {
          setSuccess('Usuário criado com sucesso!');
          carregarUsuarios();
          fecharModal();
        }
      }
      setError(null);
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      setError(err?.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();

    if (dadosSenha.nova_senha !== dadosSenha.confirmar_senha) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await usuariosService.alterarSenha(usuarioEditando.id, {
        senha_atual: dadosSenha.senha_atual,
        nova_senha: dadosSenha.nova_senha
      });

      if (response.success) {
        setSuccess('Senha alterada com sucesso!');
        fecharModalSenha();
      }
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      setError(err.response?.data?.error || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAtivo = async (id) => {
    try {
      setLoading(true);
      const response = await usuariosService.toggleAtivo(id);
      
      if (response) {
        setSuccess(response.message);
        carregarUsuarios();
      }
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      setError(err.response?.data?.error || 'Erro ao alterar status do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await usuariosService.excluir(id);
      
      if (response.success) {
        setSuccess('Usuário excluído com sucesso!');
        carregarUsuarios();
      }
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      setError(err.response?.data?.error || 'Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (campo, valor) => {
    setDadosFormulario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSenhaChange = (campo, valor) => {
    setDadosSenha(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600 mt-2">
            Gerenciar usuários e controle de acesso ao sistema
          </p>
        </div>
        
        {hasPermission('usuarios_create') && (
          <Dialog open={modalAberto} onOpenChange={setModalAberto}>
            <DialogTrigger asChild>
              <Button onClick={() => abrirModal()} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
                </DialogTitle>
                <DialogDescription>
                  {usuarioEditando 
                    ? 'Atualize as informações do usuário.' 
                    : 'Preencha os dados para cadastrar um novo usuário.'
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={dadosFormulario.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  {!usuarioEditando && (
                    <div>
                      <Label htmlFor="senha">Senha *</Label>
                      <div className="relative">
                        <Input
                          id="senha"
                          type={mostrarSenha ? 'text' : 'password'}
                          value={dadosFormulario.senha}
                          onChange={(e) => handleInputChange('senha', e.target.value)}
                          required={!usuarioEditando}
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                          {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="perfil_id">Perfil *</Label>
                    <Select
                      value={dadosFormulario.perfil_id?.toString() || ''}
                      onValueChange={(value) => handleInputChange('perfil_id', value ? parseInt(value) : '')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {perfis.map(perfil => (
                          <SelectItem key={perfil.id} value={perfil.id.toString()}>
                            {perfil.nome} (Nível {perfil.nivel_acesso})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pessoa_id">Pessoa Associada</Label>
                    <Select
                      value={dadosFormulario.pessoa_id?.toString() || ''}
                      onValueChange={(value) => handleInputChange('pessoa_id', value ? parseInt(value) : '')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma pessoa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem >Nenhuma pessoa</SelectItem>
                        {pessoas.map(pessoa => (
                          <SelectItem key={pessoa.id} value={pessoa.id.toString()}>
                            {pessoa.nome_completo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="ativo"
                      checked={dadosFormulario.ativo}
                      onChange={(e) => handleInputChange('ativo', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="ativo">Usuário ativo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="email_verificado"
                      checked={dadosFormulario.email_verificado}
                      onChange={(e) => handleInputChange('email_verificado', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="email_verificado">Email verificado</Label>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={fecharModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                    {loading ? 'Salvando...' : usuarioEditando ? 'Atualizar' : 'Criar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Dialog open={modalSenhaAberto} onOpenChange={setModalSenhaAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Altere a senha do usuário {usuarioEditando?.email}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAlterarSenha} className="space-y-4">
            <div>
              <Label htmlFor="senha_atual">Senha Atual *</Label>
              <Input
                id="senha_atual"
                type="password"
                value={dadosSenha.senha_atual}
                onChange={(e) => handleSenhaChange('senha_atual', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="nova_senha">Nova Senha *</Label>
              <Input
                id="nova_senha"
                type="password"
                value={dadosSenha.nova_senha}
                onChange={(e) => handleSenhaChange('nova_senha', e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmar_senha">Confirmar Nova Senha *</Label>
              <Input
                id="confirmar_senha"
                type="password"
                value={dadosSenha.confirmar_senha}
                onChange={(e) => handleSenhaChange('confirmar_senha', e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={fecharModalSenha}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                {loading ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                  placeholder="Email do usuário..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="perfil_filtro">Perfil</Label>
              <Select
                value={filtros.perfil_id}
                onValueChange={(value) => handleFiltroChange('perfil_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os perfis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem >Todos os perfis</SelectItem>
                  {perfis.map(perfil => (
                    <SelectItem key={perfil.id} value={perfil.id.toString()}>
                      {perfil.nome}
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
                  <SelectItem >Todos</SelectItem>
                  <SelectItem value="true">Ativos</SelectItem>
                  <SelectItem value="false">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email_verificado_filtro">Email</Label>
              <Select
                value={filtros.email_verificado}
                onValueChange={(value) => handleFiltroChange('email_verificado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem >Todos</SelectItem>
                  <SelectItem value="true">Verificados</SelectItem>
                  <SelectItem value="false">Não verificados</SelectItem>
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
            Usuários ({paginacao.total})
          </CardTitle>
          <CardDescription>
            Lista de todos os usuários cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usuarios.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Pessoa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {usuario.email}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {usuario.email_verificado ? (
                              <Badge variant="default" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verificado
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                <XCircle className="h-3 w-3 mr-1" />
                                Não verificado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{usuario.perfil?.nome}</div>
                            <div className="text-sm text-gray-500">
                              Nível {usuario.perfil?.nivel_acesso}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {usuario.pessoa ? (
                          <div>
                            <div className="font-medium">{usuario.pessoa.nome_completo}</div>
                            {usuario.pessoa.telefone && (
                              <div className="text-sm text-gray-500">{usuario.pessoa.telefone}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={usuario.ativo ? 'default' : 'secondary'}>
                          {usuario.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {usuario.ultimo_login ? (
                          formatarData(usuario.ultimo_login)
                        ) : (
                          <span className="text-gray-400">Nunca</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {hasPermission('usuarios_update') && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => abrirModal(usuario)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => abrirModalSenha(usuario)}
                              >
                                <Key className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleAtivo(usuario.id)}
                                className={usuario.ativo ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                              >
                                {usuario.ativo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </Button>
                            </>
                          )}
                          {hasPermission('usuarios_delete') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExcluir(usuario.id)}
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
                {paginacao.total} usuários
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

export default Usuarios;

