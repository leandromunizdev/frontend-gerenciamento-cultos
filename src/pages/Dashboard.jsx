import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import cultosService from '../services/cultosService';
import escalasService from '../services/escalasService';
import visitantesService from '../services/visitantesService';
import avaliacoesService from '../services/avaliacoesService';
import {
  Calendar,
  Users,
  UserPlus,
  Star,
  Church,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    cultosProximos: 0,
    escalasAtivas: 0,
    visitantesRecentes: 0,
    avaliacoesPendentes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        cultosResponse,
        escalasResponse,
        visitantesResponse,
        avaliacoesResponse
      ] = await Promise.allSettled([
        cultosService.listar({ limit: 100 }),
        escalasService.estatisticas(),
        visitantesService.estatisticas(),
        avaliacoesService.estatisticas()
      ]);

      console.log('Cultos', cultosResponse);
      console.log('Escalas', escalasResponse);
      console.log('Visitantes', visitantesResponse);
      console.log('Avaliações', avaliacoesResponse)

      const novasStats = {
        cultosProximos: 0,
        escalasAtivas: 0,
        visitantesRecentes: 0,
        avaliacoesPendentes: 0
      };

      // Cultos próximos (próximos 7 dias)
      if (cultosResponse.status === 'fulfilled' && cultosResponse.value) {
        const hoje = new Date();
        const proximosSete = new Date();
        proximosSete.setDate(hoje.getDate() + 7);
        
        novasStats.cultosProximos = cultosResponse.value.cultos.filter(culto => {
          const dataCulto = new Date(culto.data_culto);
          return dataCulto >= hoje && dataCulto <= proximosSete;
        }).length;
      }

      // Escalas ativas
      if (escalasResponse.status === 'fulfilled' && escalasResponse.value) {
        novasStats.escalasAtivas = escalasResponse.value.total || 0;
      }

      // Visitantes recentes (últimos 30 dias)
      if (visitantesResponse.status === 'fulfilled' && visitantesResponse.value) {
        novasStats.visitantesRecentes = visitantesResponse.value.visitantesMes || 0;
      }

      // Avaliações pendentes (hoje)
      if (avaliacoesResponse.status === 'fulfilled' && avaliacoesResponse.value) {
        novasStats.avaliacoesPendentes = avaliacoesResponse.value.avaliacoesHoje || 0;
      }

      setStats(novasStats);

    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError('Erro ao carregar estatísticas do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Cultos Próximos',
      value: stats.cultosProximos,
      description: 'Nos próximos 7 dias',
      icon: Church,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Escalas Ativas',
      value: stats.escalasAtivas,
      description: 'Pessoas escaladas',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Visitantes Recentes',
      value: stats.visitantesRecentes,
      description: 'Últimos 30 dias',
      icon: UserPlus,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Avaliações Pendentes',
      value: stats.avaliacoesPendentes,
      description: 'Aguardando análise',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'culto',
      title: 'Culto de Domingo criado',
      description: 'Culto de Celebração - 07/07/2025 às 19h',
      time: '2 horas atrás',
      icon: Church,
      status: 'success'
    },
    {
      id: 2,
      type: 'escala',
      title: 'Escala confirmada',
      description: 'João Silva confirmou presença na escala de louvor',
      time: '4 horas atrás',
      icon: CheckCircle,
      status: 'success'
    },
    {
      id: 3,
      type: 'visitante',
      title: 'Novo visitante cadastrado',
      description: 'Maria Santos - Primeira visita',
      time: '6 horas atrás',
      icon: UserPlus,
      status: 'info'
    },
    {
      id: 4,
      type: 'avaliacao',
      title: 'Nova avaliação recebida',
      description: 'Avaliação do culto de quarta-feira',
      time: '1 dia atrás',
      icon: Star,
      status: 'warning'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo, {user?.pessoa?.nome_completo || user?.nome || 'Usuário'}! Aqui está um resumo das atividades da igreja.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas atividades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Icon className={`h-4 w-4 ${getStatusColor(activity.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate('/cultos')}>
                <Church className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">Cultos</h3>
                <p className="text-sm text-gray-500">Criar culto</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate('/escalas')}>
                <Calendar className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-medium">Nova Escala</h3>
                <p className="text-sm text-gray-500">Escalar pessoa</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate('/visitantes')}>
                <UserPlus className="h-8 w-8 text-orange-600 mb-2" />
                <h3 className="font-medium">Visitante</h3>
                <p className="text-sm text-gray-500">Cadastrar visitante</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate('/avaliacoes')}>
                <Star className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-medium">Avaliações</h3>
                <p className="text-sm text-gray-500">Ver feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p className="text-lg">{user?.pessoa?.nome_completo || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg">{user?.email || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Perfil</p>
              <Badge variant="secondary" className="mt-1">
                {user?.perfil?.nome || 'Membro'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

