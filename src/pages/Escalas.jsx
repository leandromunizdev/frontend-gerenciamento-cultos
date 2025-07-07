import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import escalasService from '../services/escalasService';
import cultosService from '../services/cultosService';
import pessoasService from '../services/pessoasService';
import funcoesService from '../services/funcoesService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from '../components/ui/textarea';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  User
} from 'lucide-react';
import { formatarData, formatarDataHora } from '../utils/formatters';

const Escalas = () => {
  const { hasPermission } = useAuth();
  const [escalas, setEscalas] = useState([]);
  const [cultos, setCultos] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    busca: '',
    data_inicio: '',
    data_fim: '',
    status_id: '',
    culto_id: ''
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [escalaEditando, setEscalaEditando] = useState(null);
  const [formData, setFormData] = useState({
    pessoa_id: '',
    funcao_id: '',
    culto_id: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [escalasResponse, cultosResponse, pessoasResponse, funcoesResponse] = await Promise.all([
        escalasService.listar(filtros),
        cultosService.listar(),
        pessoasService.listar(),
        funcoesService.listar()
      ]);

      if (escalasResponse) {
        setEscalas(escalasResponse.escalas || escalasResponse.data || []);
      }

      if (cultosResponse) {
        setCultos(cultosResponse.cultos || cultosResponse.data || []);
      }

      if (pessoasResponse) {
        setPessoas(pessoasResponse.pessoas || pessoasResponse.data || []);
      }

      if (funcoesResponse) {
        setFuncoes(funcoesResponse.funcoes || funcoesResponse.data || []);
      }
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (escalaEditando) {
        await escalasService.atualizar(escalaEditando.id, formData);
      } else {
        await escalasService.criar(formData);
      }
      
      setModalAberto(false);
      setEscalaEditando(null);
      setFormData({
        pessoa_id: '',
        funcao_id: '',
        culto_id: '',
        observacoes: ''
      });
      carregarDados();
      setError(null);
    } catch (err) {
      setError(err?.message || 'Erro ao salvar escala');
    }
  };

  const handleEditar = (escala) => {
    console.log('Escala edit', escala);
    setEscalaEditando(escala);
    setFormData({
      pessoa_id: String(escala.pessoa_id),
      funcao_id: String(escala.funcao_id),
      culto_id: String(escala.culto_id),
      observacoes: escala.observacoes || ''
    });
    setModalAberto(true);
  };

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta escala?')) {
      try {
        await escalasService.excluir(id);
        carregarDados();
      } catch (err) {
        setError('Erro ao excluir escala');
      }
    }
  };

  const handleConfirmar = async (id) => {
    try {
      await escalasService.confirmar(id);
      carregarDados();
    } catch (err) {
      setError('Erro ao confirmar escala');
    }
  };

  const handleCancelar = async (id) => {
    try {
      await escalasService.cancelar(id);
      carregarDados();
    } catch (err) {
      setError('Erro ao cancelar escala');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pendente': { variant: 'secondary', icon: Clock },
      'Confirmada': { variant: 'default', icon: CheckCircle },
      'Cancelada': { variant: 'destructive', icon: XCircle }
    };

    const config = statusMap[status] || { variant: 'secondary', icon: Clock };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Escalas</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as escalas de pessoas nos cultos
          </p>
        </div>
        {hasPermission('escalas_create') && (
          <Dialog open={modalAberto} onOpenChange={setModalAberto}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Nova Escala
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {escalaEditando ? 'Editar Escala' : 'Nova Escala'}
                </DialogTitle>
                <DialogDescription>
                  {escalaEditando 
                    ? 'Edite as informações da escala'
                    : 'Preencha os dados para criar uma nova escala'
                  }
                </DialogDescription>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}                
              </DialogHeader>              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pessoa_id">Pessoa</Label>
                  <Select
                    value={formData.pessoa_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, pessoa_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma pessoa" />
                    </SelectTrigger>
                    <SelectContent>
                      {pessoas.map(pessoa => (
                        <SelectItem key={pessoa.id} value={pessoa.id.toString()}>
                          {pessoa.nome_completo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funcao_id">Função</Label>
                  <Select
                    value={formData.funcao_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, funcao_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      {funcoes.map(funcao => (
                        <SelectItem key={funcao.id} value={funcao.id.toString()}>
                          {funcao.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culto_id">Culto</Label>
                  <Select
                    value={formData.culto_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, culto_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um culto" />
                    </SelectTrigger>
                    <SelectContent>
                      {cultos.map(culto => (
                        <SelectItem key={culto.id} value={culto.id.toString()}>
                          {culto.titulo} - {formatarData(culto.data_hora)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Observações sobre a escala..."
                    value={formData.observacoes}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setModalAberto(false);
                      setEscalaEditando(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                    {escalaEditando ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por observações..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={filtros.data_inicio}
                onChange={(e) => handleFiltroChange('data_inicio', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={filtros.data_fim}
                onChange={(e) => handleFiltroChange('data_fim', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Culto</Label>
              <Select
                value={filtros.culto_id}
                onValueChange={(value) => handleFiltroChange('culto_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os cultos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem>Todos os cultos</SelectItem>
                  {cultos.map(culto => (
                    <SelectItem key={culto.id} value={culto.id.toString()}>
                      {culto.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Escalas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {escalas.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma escala encontrada
            </h3>
            <p className="text-gray-500">
              {hasPermission('escalas_create') 
                ? 'Crie a primeira escala clicando no botão "Nova Escala"'
                : 'Não há escalas cadastradas no momento'
              }
            </p>
          </div>
        ) : (
          escalas.map((escala) => (
            <Card key={escala.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {escala.culto?.titulo || 'Culto não informado'}
                    </CardTitle>
                    <CardDescription>
                      {formatarData(escala.culto.data_culto)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(escala.status?.nome || 'Pendente')}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {escala.pessoa?.nome_completo || 'Pessoa não informada'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {escala.funcao?.nome || 'Função não informada'}
                    </span>
                  </div>

                  {escala.observacoes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {escala.observacoes}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex space-x-2">
                      {hasPermission('escalas_update') && escala.status?.nome !== 'Confirmada' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditar(escala)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {hasPermission('escalas_delete') && escala.status?.nome !== 'Confirmada' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExcluir(escala.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {escala.status?.nome === 'Pendente' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmar(escala.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelar(escala.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Escalas;

