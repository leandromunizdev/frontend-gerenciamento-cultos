import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import configuracaoService from '../services/configuracaoService';
import {
  Settings,
  Save,
  Download,
  Server,
  Database,
  HardDrive,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  Shield,
  Globe,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar
} from 'lucide-react';

const Configuracoes = () => {
  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [configuracoes, setConfiguracoes] = useState({
    nome_igreja: '',
    endereco: '',
    telefone: '',
    email: '',
    site: '',
    pastor_principal: '',
    horarios_cultos: {
      domingo_manha: '',
      domingo_noite: '',
      quarta_feira: '',
      sexta_feira: ''
    },
    configuracoes_sistema: {
      permitir_autoconfirmacao_escalas: false,
      dias_antecedencia_escala: 7,
      notificar_escalas_por_email: true,
      notificar_escalas_por_sms: false,
      backup_automatico: true,
      manutencao_programada: false
    },
    redes_sociais: {
      facebook: '',
      instagram: '',
      youtube: '',
      whatsapp: ''
    }
  });

  const [statusSistema, setStatusSistema] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    carregarConfiguracoes();
    carregarStatusSistema();
    carregarLogs();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true);
      const response = await configuracaoService.obter();
      
      if (response.success) {
        setConfiguracoes(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const carregarStatusSistema = async () => {
    try {
      const response = await configuracaoService.obterStatus();
      
      if (response.success) {
        setStatusSistema(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar status do sistema:', err);
    }
  };

  const carregarLogs = async () => {
    try {
      const response = await configuracaoService.obterLogs({ limit: 50 });
      
      if (response.success) {
        setLogs(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar logs:', err);
    }
  };

  const handleSalvar = async () => {
    try {
      setSaving(true);
      setError('');
      
      const response = await configuracaoService.atualizar(configuracoes);
      
      if (response.success) {
        setSuccess('Configurações salvas com sucesso!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      setError(err.response?.data?.error || 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleGerarBackup = async () => {
    try {
      setError('');
      
      const response = await configuracaoService.gerarBackup();
      
      if (response.success) {
        setSuccess(`Backup gerado: ${response.data.nome_backup}`);
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Erro ao gerar backup:', err);
      setError(err.response?.data?.error || 'Erro ao gerar backup');
    }
  };

  const handleInputChange = (campo, valor, secao = null) => {
    if (secao) {
      setConfiguracoes(prev => ({
        ...prev,
        [secao]: {
          ...prev[secao],
          [campo]: valor
        }
      }));
    } else {
      setConfiguracoes(prev => ({
        ...prev,
        [campo]: valor
      }));
    }
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getLogIcon = (nivel) => {
    switch (nivel) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">
            Gerenciar configurações do sistema e da igreja
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleGerarBackup}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Gerar Backup
          </Button>
          
          {hasPermission('configuracoes_update') && (
            <Button
              onClick={handleSalvar}
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          )}
        </div>
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

      {/* Tabs de Configurações */}
      <Tabs defaultValue="igreja" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="igreja">Igreja</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Configurações da Igreja */}
        <TabsContent value="igreja" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Informações da Igreja
              </CardTitle>
              <CardDescription>
                Dados básicos e informações de contato da igreja
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome_igreja">Nome da Igreja</Label>
                  <Input
                    id="nome_igreja"
                    value={configuracoes.nome_igreja}
                    onChange={(e) => handleInputChange('nome_igreja', e.target.value)}
                    disabled={!hasPermission('configuracoes_update')}
                  />
                </div>

                <div>
                  <Label htmlFor="pastor_principal">Pastor Principal</Label>
                  <Input
                    id="pastor_principal"
                    value={configuracoes.pastor_principal}
                    onChange={(e) => handleInputChange('pastor_principal', e.target.value)}
                    disabled={!hasPermission('configuracoes_update')}
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={configuracoes.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    disabled={!hasPermission('configuracoes_update')}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={configuracoes.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!hasPermission('configuracoes_update')}
                  />
                </div>

                <div>
                  <Label htmlFor="site">Site</Label>
                  <Input
                    id="site"
                    value={configuracoes.site}
                    onChange={(e) => handleInputChange('site', e.target.value)}
                    disabled={!hasPermission('configuracoes_update')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={configuracoes.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  disabled={!hasPermission('configuracoes_update')}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Horários dos Cultos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Horários dos Cultos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="domingo_manha">Domingo Manhã</Label>
                  <Input
                    id="domingo_manha"
                    type="time"
                    value={configuracoes.horarios_cultos?.domingo_manha || ''}
                    onChange={(e) => handleInputChange('domingo_manha', e.target.value, 'horarios_cultos')}
                    disabled={!hasPermission('configuracoes_update')}
                  />
                </div>

                <div>
                  <Label htmlFor="domingo_noite">Domingo Noite</Label>
                  <Input
                    id="domingo_noite"
                    type="time"
                    value={configuracoes.horarios_cultos?.domingo_noite || ''}
                    onChange={(e) => handleInputChange('domingo_noite', e.target.value, 'horarios_cultos')}
                    disabled={!hasPermission('configuracoes_update')}
                  />
                </div>

                <div>
                  <Label htmlFor="quarta_feira">Quarta-feira</Label>
                  <Input
                    id="quarta_feira"
                    type="time"
                    value={configuracoes.horarios_cultos?.quarta_feira || ''}
                    onChange={(e) => handleInputChange('quarta_feira', e.target.value, 'horarios_cultos')}
                    disabled={!hasPermission('configuracoes_update')}
                  />
                </div>

                <div>
                  <Label htmlFor="sexta_feira">Sexta-feira</Label>
                  <Input
                    id="sexta_feira"
                    type="time"
                    value={configuracoes.horarios_cultos?.sexta_feira || ''}
                    onChange={(e) => handleInputChange('sexta_feira', e.target.value, 'horarios_cultos')}
                    disabled={!hasPermission('configuracoes_update')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={configuracoes.redes_sociais?.facebook || ''}
                    onChange={(e) => handleInputChange('facebook', e.target.value, 'redes_sociais')}
                    disabled={!hasPermission('configuracoes_update')}
                    placeholder="https://facebook.com/suaigreja"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={configuracoes.redes_sociais?.instagram || ''}
                    onChange={(e) => handleInputChange('instagram', e.target.value, 'redes_sociais')}
                    disabled={!hasPermission('configuracoes_update')}
                    placeholder="@suaigreja"
                  />
                </div>

                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={configuracoes.redes_sociais?.youtube || ''}
                    onChange={(e) => handleInputChange('youtube', e.target.value, 'redes_sociais')}
                    disabled={!hasPermission('configuracoes_update')}
                    placeholder="https://youtube.com/suaigreja"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={configuracoes.redes_sociais?.whatsapp || ''}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value, 'redes_sociais')}
                    disabled={!hasPermission('configuracoes_update')}
                    placeholder="5511999999999"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações do Sistema */}
        <TabsContent value="sistema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>
                Configurações de funcionamento e comportamento do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Permitir autoconfirmação de escalas</Label>
                    <p className="text-sm text-gray-500">
                      Permite que pessoas confirmem suas próprias escalas
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={configuracoes.configuracoes_sistema?.permitir_autoconfirmacao_escalas || false}
                    onChange={(e) => handleInputChange('permitir_autoconfirmacao_escalas', e.target.checked, 'configuracoes_sistema')}
                    disabled={!hasPermission('configuracoes_update')}
                    className="rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificar escalas por email</Label>
                    <p className="text-sm text-gray-500">
                      Enviar notificações de escalas por email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={configuracoes.configuracoes_sistema?.notificar_escalas_por_email || false}
                    onChange={(e) => handleInputChange('notificar_escalas_por_email', e.target.checked, 'configuracoes_sistema')}
                    disabled={!hasPermission('configuracoes_update')}
                    className="rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Backup automático</Label>
                    <p className="text-sm text-gray-500">
                      Realizar backup automático do sistema
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={configuracoes.configuracoes_sistema?.backup_automatico || false}
                    onChange={(e) => handleInputChange('backup_automatico', e.target.checked, 'configuracoes_sistema')}
                    disabled={!hasPermission('configuracoes_update')}
                    className="rounded border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="dias_antecedencia">Dias de antecedência para escalas</Label>
                  <Input
                    id="dias_antecedencia"
                    type="number"
                    min="1"
                    max="30"
                    value={configuracoes.configuracoes_sistema?.dias_antecedencia_escala || 7}
                    onChange={(e) => handleInputChange('dias_antecedencia_escala', parseInt(e.target.value), 'configuracoes_sistema')}
                    disabled={!hasPermission('configuracoes_update')}
                    className="w-32"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Quantos dias antes do culto as escalas devem ser criadas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status do Sistema */}
        <TabsContent value="status" className="space-y-6">
          {statusSistema && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Server className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Versão</p>
                        <p className="text-2xl font-bold">{statusSistema.versao}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Database className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Banco de Dados</p>
                        <p className="text-lg font-bold capitalize">{statusSistema.banco_dados?.status}</p>
                        <p className="text-xs text-gray-500">{statusSistema.banco_dados?.versao}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Memória</p>
                        <p className="text-lg font-bold">{statusSistema.memoria?.percentual}%</p>
                        <p className="text-xs text-gray-500">
                          {statusSistema.memoria?.usada} / {statusSistema.memoria?.total}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Uptime</p>
                        <p className="text-lg font-bold">{formatUptime(statusSistema.uptime)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Informações Detalhadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Armazenamento</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Usado:</span>
                          <span>{statusSistema.disco?.usado}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span>{statusSistema.disco?.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{ width: `${statusSistema.disco?.percentual}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Backup</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Último backup:</span>
                          <span>{statusSistema.ultimo_backup}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Backup automático:</span>
                          <Badge variant={configuracoes.configuracoes_sistema?.backup_automatico ? 'default' : 'secondary'}>
                            {configuracoes.configuracoes_sistema?.backup_automatico ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Logs do Sistema */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Logs do Sistema
              </CardTitle>
              <CardDescription>
                Últimas atividades e eventos do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum log encontrado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getLogIcon(log.nivel)}
                      <div className="flex-1">
                        <p className="text-sm">{log.mensagem}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                          <span>Usuário: {log.usuario}</span>
                          <span>IP: {log.ip}</span>
                        </div>
                      </div>
                      <Badge variant={
                        log.nivel === 'error' ? 'destructive' : 
                        log.nivel === 'warning' ? 'secondary' : 'default'
                      }>
                        {log.nivel}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;

