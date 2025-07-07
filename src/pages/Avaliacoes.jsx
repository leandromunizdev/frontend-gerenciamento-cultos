import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import avaliacoesService from '../services/avaliacoesService';
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
import {
  Star,
  Filter,
  Eye,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { formatarData } from '../utils/formatters';

const Avaliacoes = () => {
  const { hasPermission } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    data_inicio: '',
    data_fim: '',
    recomendaria: ''
  });
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);
  const [modalDetalhes, setModalDetalhes] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const response = await avaliacoesService.listar(filtros);

      if (response) {
        setAvaliacoes(response.avaliacoes || []);
      }
      setError(null);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar avaliações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await avaliacoesService.estatisticas();
      if (response) {
        setEstatisticas(response);
      }
    } catch (err) {
      setError(err?.message || 'Erro ao carregar estatísticas');
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        await avaliacoesService.excluir(id);
        carregarDados();
        carregarEstatisticas();
      } catch (err) {
        setError('Erro ao excluir avaliação');
      }
    }
  };

  const handleVerDetalhes = (avaliacao) => {
    setAvaliacaoSelecionada(avaliacao);
    setModalDetalhes(true);
  };

  const renderEstrelas = (nota) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i <= nota 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getMediaCriterios = (criterios) => {
    if (!criterios || criterios.length === 0) return 0;
    const soma = criterios.reduce((acc, c) => acc + c.nota, 0);
    return (soma / criterios.length).toFixed(1);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Avaliações</h1>
          <p className="text-gray-600 mt-2">
            Feedback dos visitantes e membros sobre os cultos
          </p>
        </div>
        <Button
          onClick={() => window.open('/avaliacao-publica', '_blank')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Página Pública
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Avaliações
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalAvaliacoes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {estatisticas.avaliacoesMes || 0} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recomendações
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.percentualRecomendacao || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {estatisticas.recomendariam || 0} de {estatisticas.totalAvaliacoes || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avaliações Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.avaliacoesHoje || 0}</div>
            <p className="text-xs text-muted-foreground">
              Recebidas hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Este Ano
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.avaliacoesAno || 0}</div>
            <p className="text-xs text-muted-foreground">
              Avaliações em 2025
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Média por Critério */}
      {estatisticas.mediaCriterios && estatisticas.mediaCriterios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Média por Critério</CardTitle>
            <CardDescription>
              Avaliação média de cada aspecto do culto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {estatisticas.mediaCriterios.map((criterio, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{criterio.criterio}</p>
                    <p className="text-sm text-gray-500">
                      {criterio.total_avaliacoes} avaliações
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{criterio.media_nota}</span>
                    {renderEstrelas(Math.round(criterio.media_nota))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label>Recomendação</Label>
              <Select
                value={filtros.recomendaria}
                onValueChange={(value) => handleFiltroChange('recomendaria', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem>Todas</SelectItem>
                  <SelectItem value="true">Recomenda</SelectItem>
                  <SelectItem value="false">Não recomenda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Avaliações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avaliacoes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma avaliação encontrada
            </h3>
            <p className="text-gray-500">
              Não há avaliações que correspondam aos filtros selecionados
            </p>
          </div>
        ) : (
          avaliacoes.map((avaliacao) => (
            <Card key={avaliacao.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {avaliacao.nome_avaliador || 'Anônimo'}
                    </CardTitle>
                    <CardDescription>
                      Visitou em {formatarData(avaliacao.data_visita)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {avaliacao.recomendaria === true && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        Recomenda
                      </Badge>
                    )}
                    {avaliacao.recomendaria === false && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3" />
                        Não recomenda
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Média Geral:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{getMediaCriterios(avaliacao.criterios)}</span>
                      {renderEstrelas(Math.round(getMediaCriterios(avaliacao.criterios)))}
                    </div>
                  </div>

                  {avaliacao.comentario_geral && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded line-clamp-3">
                      "{avaliacao.comentario_geral}"
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerDetalhes(avaliacao)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    
                    {hasPermission('avaliacoes_delete') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExcluir(avaliacao.id)}
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

      {/* Modal de Detalhes */}
      <Dialog open={modalDetalhes} onOpenChange={setModalDetalhes}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Avaliação</DialogTitle>
            <DialogDescription>
              Avaliação completa do visitante
            </DialogDescription>
          </DialogHeader>
          
          {avaliacaoSelecionada && (
            <div className="space-y-4">
              {/* Informações Básicas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-sm">{avaliacaoSelecionada.nome_avaliador || 'Anônimo'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{avaliacaoSelecionada.email_avaliador || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data da Visita</Label>
                  <p className="text-sm">{formatarData(avaliacaoSelecionada.data_visita)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Recomendaria</Label>
                  <p className="text-sm">
                    {avaliacaoSelecionada.recomendaria === true ? 'Sim' : 
                     avaliacaoSelecionada.recomendaria === false ? 'Não' : 'Não informado'}
                  </p>
                </div>
              </div>

              {/* Critérios Avaliados */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Avaliações por Critério</Label>
                <div className="space-y-3">
                  {avaliacaoSelecionada.criterios?.map(criterio => (
                    <div key={criterio.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{criterio.criterio?.nome}</p>
                        {criterio.criterio?.descricao && (
                          <p className="text-sm text-gray-500">{criterio.criterio.descricao}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{criterio.nota}</span>
                        {renderEstrelas(criterio.nota)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comentário */}
              {avaliacaoSelecionada.comentario_geral && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Comentário Geral</Label>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-sm">{avaliacaoSelecionada.comentario_geral}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Avaliacoes;

