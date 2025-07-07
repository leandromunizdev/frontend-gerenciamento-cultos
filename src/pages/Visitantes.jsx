import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import visitantesService from '../services/visitantesService';
import formasConhecimentoService from '../services/formasConhecimentoService';
import cultosService from '../services/cultosService';
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
import { Checkbox } from '../components/ui/checkbox';
import {
  UserPlus,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Calendar,
  Church,
  MapPin,
  Heart
} from 'lucide-react';
import { formatarData } from '../utils/formatters';
import { phoneMask, validatePhone } from '../utils/masks';

const Visitantes = () => {
  const { hasPermission } = useAuth();
  const [visitantes, setVisitantes] = useState([]);
  const [formasConhecimento, setFormasConhecimento] = useState([]);
  const [cultos, setCultos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    busca: '',
    data_inicio: '',
    data_fim: '',
    culto_id: '',
    eh_cristao: ''
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [visitanteEditando, setVisitanteEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome_completo: '',
    whatsapp: '',
    data_nascimento: '',
    eh_cristao: null,
    mora_perto: null,
    igreja_origem: '',
    forma_conhecimento_id: '',
    observacoes: '',
    avisos_organizador: '',
    data_visita: new Date().toISOString().split('T')[0],
    culto_id: ''
  });

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      const [formasResponse, cultosResponse] = await Promise.all([
        formasConhecimentoService.listar(),
        cultosService.listar()
      ]);

      if (formasResponse) {
        setFormasConhecimento(formasResponse.formas || []);
      }

      if (cultosResponse) {
        setCultos(cultosResponse.cultos || []);
      }
    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
    }
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const response = await visitantesService.listar(filtros);

      if (response) {
        setVisitantes(response.visitantes || []);
      }
      setError(null);
    } catch (err) {
      setError('Erro ao carregar visitantes');
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
      const dadosEnvio = { ...formData };
      
      Object.keys(dadosEnvio).forEach(key => {
        if (dadosEnvio[key] === null || dadosEnvio[key] === '') {
          delete dadosEnvio[key];
        }
      });

      if (visitanteEditando) {
        await visitantesService.atualizar(visitanteEditando.id, dadosEnvio);
      } else {
        await visitantesService.criar(dadosEnvio);
      }
      
      setModalAberto(false);
      setVisitanteEditando(null);
      resetForm();
      carregarDados();
      setError(null)
    } catch (err) {
      setError(err?.message || 'Erro ao salvar visitante');
    }
  };

  const resetForm = () => {
    setFormData({
      nome_completo: '',
      whatsapp: '',
      data_nascimento: '',
      eh_cristao: null,
      mora_perto: null,
      igreja_origem: '',
      forma_conhecimento_id: '',
      observacoes: '',
      avisos_organizador: '',
      data_visita: new Date().toISOString().split('T')[0],
      culto_id: ''
    });
  };

  const handleEditar = (visitante) => {
    setVisitanteEditando(visitante);
    setFormData({
      nome_completo: visitante.nome_completo || '',
      whatsapp: visitante.whatsapp || '',
      data_nascimento: visitante.data_nascimento || '',
      eh_cristao: visitante.eh_cristao,
      mora_perto: visitante.mora_perto,
      igreja_origem: visitante.igreja_origem || '',
      forma_conhecimento_id: visitante.forma_conhecimento_id?.toString() || '',
      observacoes: visitante.observacoes || '',
      avisos_organizador: visitante.avisos_organizador || '',
      data_visita: visitante.data_visita || '',
      culto_id: visitante.culto_id?.toString() || ''
    });
    setModalAberto(true);
  };

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir este visitante?')) {
      try {
        await visitantesService.excluir(id);
        carregarDados();
      } catch (err) {
        setError('Erro ao excluir visitante');
      }
    }
  };

  const handleNovoVisitante = () => {
    setVisitanteEditando(null);
    resetForm();
    setModalAberto(true);
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
          <h1 className="text-3xl font-bold text-gray-900">Visitantes</h1>
          <p className="text-gray-600 mt-2">
            Gerencie o cadastro de visitantes da igreja
          </p>
        </div>
        {hasPermission('visitantes_create') && (
          <Button 
            onClick={handleNovoVisitante}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Visitante
          </Button>
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
                  placeholder="Nome ou WhatsApp..."
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
              <Label>É Cristão</Label>
              <Select
                value={filtros.eh_cristao}
                onValueChange={(value) => handleFiltroChange('eh_cristao', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem>Todos</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Visitantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visitantes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum visitante encontrado
            </h3>
            <p className="text-gray-500">
              {hasPermission('visitantes_create') 
                ? 'Cadastre o primeiro visitante clicando no botão "Novo Visitante"'
                : 'Não há visitantes cadastrados no momento'
              }
            </p>
          </div>
        ) : (
          visitantes.map((visitante) => (
            <Card key={visitante.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {visitante.nome_completo}
                    </CardTitle>
                    <CardDescription>
                      Visitou em {formatarData(visitante.data_visita)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {visitante.eh_cristao && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        Cristão
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visitante.whatsapp && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{visitante.whatsapp}</span>
                    </div>
                  )}

                  {visitante.culto && (
                    <div className="flex items-center gap-2">
                      <Church className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{visitante.culto.titulo}</span>
                    </div>
                  )}

                  {visitante.formaConhecimento && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{visitante.formaConhecimento.nome}</span>
                    </div>
                  )}

                  {visitante.igreja_origem && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Igreja de origem:</strong> {visitante.igreja_origem}
                    </div>
                  )}

                  {visitante.observacoes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {visitante.observacoes}
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-3 border-t">
                    {hasPermission('visitantes_update') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditar(visitante)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {hasPermission('visitantes_delete') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExcluir(visitante.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {visitanteEditando ? 'Editar Visitante' : 'Novo Visitante'}
            </DialogTitle>
            <DialogDescription>
              {visitanteEditando 
                ? 'Edite as informações do visitante'
                : 'Preencha os dados para cadastrar um novo visitante'
              }
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome_completo">Nome Completo *</Label>
                <Input
                  id="nome_completo"
                  value={formData.nome_completo}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: phoneMask(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) => setFormData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_visita">Data da Visita *</Label>
                <Input
                  id="data_visita"
                  type="date"
                  value={formData.data_visita}
                  onChange={(e) => setFormData(prev => ({ ...prev, data_visita: e.target.value }))}
                  required
                />
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
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eh_cristao"
                  checked={formData.eh_cristao === true}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, eh_cristao: checked }))}
                />
                <Label htmlFor="eh_cristao">É cristão?</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mora_perto"
                  checked={formData.mora_perto === true}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, mora_perto: checked }))}
                />
                <Label htmlFor="mora_perto">Mora perto da igreja?</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="igreja_origem">Igreja de Origem</Label>
              <Input
                id="igreja_origem"
                placeholder="Nome da igreja de origem"
                value={formData.igreja_origem}
                onChange={(e) => setFormData(prev => ({ ...prev, igreja_origem: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="forma_conhecimento_id">Como conheceu a igreja?</Label>
              <Select
                value={formData.forma_conhecimento_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, forma_conhecimento_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  {formasConhecimento.map(forma => (
                    <SelectItem key={forma.id} value={forma.id.toString()}>
                      {forma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações sobre o visitante..."
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avisos_organizador">Avisos para Organizador</Label>
              <Textarea
                id="avisos_organizador"
                placeholder="Avisos internos para o organizador..."
                value={formData.avisos_organizador}
                onChange={(e) => setFormData(prev => ({ ...prev, avisos_organizador: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalAberto(false);
                  setVisitanteEditando(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                {visitanteEditando ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Visitantes;

