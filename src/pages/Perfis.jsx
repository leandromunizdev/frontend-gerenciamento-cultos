import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Textarea } from '../components/ui/textarea';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import perfisService from '../services/perfisService';
import {
  Shield,
  Plus,
  Search,
  Edit,
  Trash2,
  Key,
  Users,
  AlertCircle,
  CheckCircle,
  Settings,
  Lock,
  Unlock
} from 'lucide-react';
import { set } from 'date-fns';

const Perfis = () => {
  const { hasPermission } = useAuth();
  const [perfis, setPerfis] = useState([]);
  const [permissoes, setPermissoes] = useState([]);
  const [permissoesPorModulo, setPermissoesPorModulo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [filtros, setFiltros] = useState({
    busca: '',
    ativo: '',
    nivel_acesso: ''
  });

  const [paginacao, setPaginacao] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [perfilEditando, setPerfilEditando] = useState(null);
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',
    descricao: '',
    nivel_acesso: 1,
    ativo: true,
    permissoes: []
  });

  useEffect(() => {
    carregarPerfis();
    carregarPermissoes();
  }, [filtros, paginacao.page]);

  const carregarPerfis = async () => {
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

      const response = await perfisService.listar(params);
      console.log('Perfies', response);

      if (response) {
        setPerfis(response.perfis);
        setPaginacao(prev => ({
          ...prev,
          total: response.total,
          totalPages: response.totalPages
        }));
      }
    } catch (err) {
      console.error('Erro ao carregar perfis:', err);
      setError('Erro ao carregar perfis');
    } finally {
      setLoading(false);
    }
  };

  const carregarPermissoes = async () => {
    try {
      const response = await perfisService.listarPermissoes();
      if (response) {
        setPermissoes(response.permissoes);
        setPermissoesPorModulo(response.permissoesPorModulo);
      }
    } catch (err) {
      console.error('Erro ao carregar permissões:', err);
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
      ativo: '',
      nivel_acesso: ''
    });
    setPaginacao(prev => ({ ...prev, page: 1 }));
  };

  const abrirModal = (perfil = null) => {
    if (perfil) {
      setPerfilEditando(perfil);
      setDadosFormulario({
        nome: perfil.nome || '',
        descricao: perfil.descricao || '',
        nivel_acesso: perfil.nivel_acesso || 1,
        ativo: perfil.ativo !== undefined ? perfil.ativo : true,
        permissoes: perfil.permissoes ? perfil.permissoes.map(p => p.id) : []
      });
    } else {
      setPerfilEditando(null);
      setDadosFormulario({
        nome: '',
        descricao: '',
        nivel_acesso: 1,
        ativo: true,
        permissoes: []
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPerfilEditando(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      if (perfilEditando) {
        const response = await perfisService.atualizar(perfilEditando.id, dadosFormulario);
        if (response) {
          setSuccess('Perfil atualizado com sucesso!');
          carregarPerfis();
          fecharModal();
        }
      } else {
        const response = await perfisService.criar(dadosFormulario);
        if (response) {
          setSuccess('Perfil criado com sucesso!');
          carregarPerfis();
          fecharModal();
        }
      }
      setError(null);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError(err?.message || 'Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAtivo = async (id) => {
    try {
      setLoading(true);
      const response = await perfisService.toggleAtivo(id);
      
      if (response.success) {
        setSuccess(response.message);
        carregarPerfis();
      }
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      setError(err.response?.data?.error || 'Erro ao alterar status do perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este perfil?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await perfisService.excluir(id);
      
      if (response.success) {
        setSuccess('Perfil excluído com sucesso!');
        carregarPerfis();
      }
    } catch (err) {
      console.error('Erro ao excluir perfil:', err);
      setError(err.response?.data?.error || 'Erro ao excluir perfil');
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

  const handlePermissaoChange = (permissaoId, checked) => {
    setDadosFormulario(prev => ({
      ...prev,
      permissoes: checked 
        ? [...prev.permissoes, permissaoId]
        : prev.permissoes.filter(id => id !== permissaoId)
    }));
  };

  const handleModuloChange = (modulo, checked) => {
    const permissoesDoModulo = permissoesPorModulo[modulo]?.map(p => p.id) || [];
    
    setDadosFormulario(prev => ({
      ...prev,
      permissoes: checked 
        ? [...new Set([...prev.permissoes, ...permissoesDoModulo])]
        : prev.permissoes.filter(id => !permissoesDoModulo.includes(id))
    }));
  };

  const isModuloSelecionado = (modulo) => {
    const permissoesDoModulo = permissoesPorModulo[modulo]?.map(p => p.id) || [];
    return permissoesDoModulo.length > 0 && 
           permissoesDoModulo.every(id => dadosFormulario.permissoes.includes(id));
  };

  const isModuloParcialmenteSelecionado = (modulo) => {
    const permissoesDoModulo = permissoesPorModulo[modulo]?.map(p => p.id) || [];
    return permissoesDoModulo.some(id => dadosFormulario.permissoes.includes(id)) &&
           !permissoesDoModulo.every(id => dadosFormulario.permissoes.includes(id));
  };

  if (loading && perfis.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Perfis</h1>
          <p className="text-gray-600 mt-2">
            Gerenciar perfis de usuários e permissões do sistema
          </p>
        </div>
        
        {hasPermission('perfis_create') && (
          <Dialog open={modalAberto} onOpenChange={setModalAberto}>
            <DialogTrigger asChild>
              <Button onClick={() => abrirModal()} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Perfil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {perfilEditando ? 'Editar Perfil' : 'Novo Perfil'}
                </DialogTitle>
                <DialogDescription>
                  {perfilEditando 
                    ? 'Atualize as informações do perfil e suas permissões.' 
                    : 'Preencha os dados para cadastrar um novo perfil.'
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={dadosFormulario.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nivel_acesso">Nível de Acesso *</Label>
                    <Select
                      value={dadosFormulario.nivel_acesso?.toString() || ''}
                      onValueChange={(value) => handleInputChange('nivel_acesso', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(10)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Nível {i + 1} {i === 9 ? '(Máximo)' : i === 0 ? '(Mínimo)' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={dadosFormulario.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={dadosFormulario.ativo}
                    onChange={(e) => handleInputChange('ativo', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="ativo">Perfil ativo</Label>
                </div>

                {/* Permissões */}
                <div>
                  <Label className="text-base font-semibold">Permissões</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione as permissões que este perfil terá no sistema
                  </p>

                  <Accordion type="multiple" className="w-full">
                    {Object.entries(permissoesPorModulo).map(([modulo, permissoesModulo]) => (
                      <AccordionItem key={modulo} value={modulo}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isModuloSelecionado(modulo)}
                              ref={(el) => {
                                if (el) {
                                  el.indeterminate = isModuloParcialmenteSelecionado(modulo);
                                }
                              }}
                              onChange={(e) => handleModuloChange(modulo, e.target.checked)}
                              className="rounded border-gray-300"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Settings className="h-4 w-4" />
                            <span className="font-medium">{modulo}</span>
                            <Badge variant="outline" className="ml-2">
                              {permissoesModulo.length} permissões
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                            {permissoesModulo.map((permissao) => (
                              <div key={permissao.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`permissao-${permissao.id}`}
                                  checked={dadosFormulario.permissoes.includes(permissao.id)}
                                  onChange={(e) => handlePermissaoChange(permissao.id, e.target.checked)}
                                  className="rounded border-gray-300"
                                />
                                <Label 
                                  htmlFor={`permissao-${permissao.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  <div>
                                    <div className="font-medium">{permissao.nome}</div>
                                    {permissao.descricao && (
                                      <div className="text-xs text-gray-500">{permissao.descricao}</div>
                                    )}
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
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
                    {loading ? 'Salvando...' : perfilEditando ? 'Atualizar' : 'Criar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Mensagens */}
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

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="busca">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="busca"
                  placeholder="Nome do perfil..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="nivel_acesso_filtro">Nível de Acesso</Label>
              <Select
                value={filtros.nivel_acesso}
                onValueChange={(value) => handleFiltroChange('nivel_acesso', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem>Todos os níveis</SelectItem>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Nível {i + 1}
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
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={limparFiltros}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Perfis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Perfis ({perfis?.length || 0})
          </CardTitle>
          <CardDescription>
            Lista de todos os perfis cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {perfis.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum perfil encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {perfis.map((perfil) => (
                    <TableRow key={perfil.id}>
                      <TableCell>
                        <div className="font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {perfil.nome}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {perfil.descricao || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          Nível {perfil.nivel_acesso}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          <span>{perfil.permissoes?.length || 0} permissões</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={perfil.ativo ? 'default' : 'secondary'}>
                          {perfil.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {hasPermission('perfis_update') && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => abrirModal(perfil)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleAtivo(perfil.id)}
                                className={perfil.ativo ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                              >
                                {perfil.ativo ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                              </Button>
                            </>
                          )}
                          {hasPermission('perfis_delete') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExcluir(perfil.id)}
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
                {paginacao.total} perfis
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

export default Perfis;

