import { useState, useEffect } from 'react';
import avaliacoesService from '../services/avaliacoesService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import {
  Church,
  Star,
  Send,
  CheckCircle,
  Heart,
  Users,
  Music,
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react';

const AvaliacaoPublica = () => {
  const [criterios, setCriterios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome_avaliador: '',
    email_avaliador: '',
    data_visita: new Date().toISOString().split('T')[0],
    comentario_geral: '',
    recomendaria: null,
    criterios: {}
  });

  useEffect(() => {
    carregarCriterios();
  }, []);

  const carregarCriterios = async () => {
    try {
      setLoading(true);
      const response = await avaliacoesService.listarCriterios();
      
      if (response.success) {
        setCriterios(response.data.criterios || []);
        
        const criteriosIniciais = {};
        response.data.criterios.forEach(criterio => {
          criteriosIniciais[criterio.id] = 0;
        });
        setFormData(prev => ({
          ...prev,
          criterios: criteriosIniciais
        }));
      }
    } catch (err) {
      setError('Erro ao carregar critérios de avaliação');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');

    try {
      const criteriosAvaliados = Object.values(formData.criterios).filter(nota => nota > 0);
      if (criteriosAvaliados.length === 0) {
        setError('Por favor, avalie pelo menos um critério');
        setEnviando(false);
        return;
      }

      const dadosEnvio = {
        nome_avaliador: formData.nome_avaliador || null,
        email_avaliador: formData.email_avaliador || null,
        data_visita: formData.data_visita,
        comentario_geral: formData.comentario_geral || null,
        recomendaria: formData.recomendaria,
        criterios: Object.entries(formData.criterios)
          .filter(([_, nota]) => nota > 0)
          .map(([criterio_id, nota]) => ({
            criterio_id: parseInt(criterio_id),
            nota: parseInt(nota)
          }))
      };

      await avaliacoesService.criarPublica(dadosEnvio);
      setSucesso(true);
      
      setFormData({
        nome_avaliador: '',
        email_avaliador: '',
        data_visita: new Date().toISOString().split('T')[0],
        comentario_geral: '',
        recomendaria: null,
        criterios: {}
      });

      const criteriosIniciais = {};
      criterios.forEach(criterio => {
        criteriosIniciais[criterio.id] = 0;
      });
      setFormData(prev => ({
        ...prev,
        criterios: criteriosIniciais
      }));

    } catch (err) {
      setError(err.message || 'Erro ao enviar avaliação');
    } finally {
      setEnviando(false);
    }
  };

  const handleCriterioChange = (criterioId, nota) => {
    setFormData(prev => ({
      ...prev,
      criterios: {
        ...prev.criterios,
        [criterioId]: nota
      }
    }));
  };

  const renderEstrelas = (criterioId, notaAtual) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(nota => (
          <button
            key={nota}
            type="button"
            onClick={() => handleCriterioChange(criterioId, nota)}
            className={`p-1 rounded transition-colors ${
              nota <= notaAtual
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <Star 
              className="h-6 w-6" 
              fill={nota <= notaAtual ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
    );
  };

  const getCriterioIcon = (nome) => {
    const nomeNormalizado = nome.toLowerCase();
    if (nomeNormalizado.includes('louvor') || nomeNormalizado.includes('música')) {
      return Music;
    }
    if (nomeNormalizado.includes('pregação') || nomeNormalizado.includes('palavra')) {
      return MessageSquare;
    }
    if (nomeNormalizado.includes('recepção') || nomeNormalizado.includes('acolhimento')) {
      return Users;
    }
    if (nomeNormalizado.includes('organização') || nomeNormalizado.includes('pontualidade')) {
      return Clock;
    }
    return Sparkles;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Avaliação Enviada!
            </CardTitle>
            <CardDescription>
              Obrigado pelo seu feedback! Sua opinião é muito importante para nós.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setSucesso(false)}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Fazer Nova Avaliação
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Church className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Avaliação do Culto
            </CardTitle>
            <CardDescription className="text-lg">
              Assembleia de Deus de Piedade
            </CardDescription>
            <p className="text-gray-600 mt-2">
              Sua opinião é muito importante para nós! Avalie sua experiência no culto.
            </p>
          </CardHeader>
        </Card>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-600" />
              Conte-nos sobre sua experiência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_avaliador">Seu Nome (opcional)</Label>
                  <Input
                    id="nome_avaliador"
                    placeholder="Como podemos te chamar?"
                    value={formData.nome_avaliador}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_avaliador: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_avaliador">Seu Email (opcional)</Label>
                  <Input
                    id="email_avaliador"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email_avaliador}
                    onChange={(e) => setFormData(prev => ({ ...prev, email_avaliador: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_visita">Data da sua visita *</Label>
                <Input
                  id="data_visita"
                  type="date"
                  value={formData.data_visita}
                  onChange={(e) => setFormData(prev => ({ ...prev, data_visita: e.target.value }))}
                  required
                />
              </div>

              {/* Critérios de Avaliação */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Avalie os aspectos do culto
                </h3>
                <p className="text-sm text-gray-600">
                  Clique nas estrelas para dar sua nota (1 = Ruim, 5 = Excelente)
                </p>

                {criterios.map(criterio => {
                  const IconComponent = getCriterioIcon(criterio.nome);
                  return (
                    <div key={criterio.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {criterio.nome}
                          </h4>
                          {criterio.descricao && (
                            <p className="text-sm text-gray-600 mb-3">
                              {criterio.descricao}
                            </p>
                          )}
                          {renderEstrelas(criterio.id, formData.criterios[criterio.id] || 0)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recomendação */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recomendação
                </h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recomendaria"
                    checked={formData.recomendaria === true}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      recomendaria: checked 
                    }))}
                  />
                  <Label htmlFor="recomendaria" className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Eu recomendaria esta igreja para outras pessoas
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comentario_geral">
                  Comentários adicionais (opcional)
                </Label>
                <Textarea
                  id="comentario_geral"
                  placeholder="Conte-nos mais sobre sua experiência, sugestões ou elogios..."
                  value={formData.comentario_geral}
                  onChange={(e) => setFormData(prev => ({ ...prev, comentario_geral: e.target.value }))}
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={enviando}
                className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
              >
                {enviando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Avaliação
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Sua avaliação é anônima e nos ajuda a melhorar nossos cultos.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AvaliacaoPublica;

