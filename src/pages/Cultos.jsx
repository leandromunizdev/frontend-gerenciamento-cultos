import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import cultosService from '../services/cultosService';
import { tiposCultosService } from '../services/tiposCultosService';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle
} from 'lucide-react';

const Cultos = () => {
  const { user, hasPermission } = useAuth();
  const [cultos, setCultos] = useState([]);
  const [tiposCultos, setTiposCultos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros e paginação
  const [filtros, setFiltros] = useState({
    busca: '',
    data_inicio: '',
    data_fim: '',
    tipo_culto_id: '',
    status_id: ''
  });
  const [paginacao, setPaginacao] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); 
  const [selectedCulto, setSelectedCulto] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_culto: '',
    horario_inicio: '',
    horario_fim: '',
    local: '',
    observacoes: '',
    tipo_culto_id: ''
  });

  useEffect(() => {
    carregarDados();
  }, [filtros, paginacao.page]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar cultos
      const responseCultos = await cultosService.listar({
        ...filtros,
        page: paginacao.page,
        limit: paginacao.limit
      });
      
      if (responseCultos) {
        setCultos(responseCultos.cultos);
        setPaginacao(prev => ({
          ...prev,
          ...responseCultos.pagination
        }));
      }

      const responseTipos = await tiposCultosService.listar();
      console.log('Response Tipos Culto', responseTipos);
      if (responseTipos) {
        setTiposCultos(responseTipos);
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
    setPaginacao(prev => ({ ...prev, page: 1 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let response;
      if (modalType === 'create') {
        response = await cultosService.criar(formData);
      } else if (modalType === 'edit') {
        response = await cultosService.atualizar(selectedCulto.id, formData);
      }

      if (response) {
        setShowModal(false);
        resetForm();
        carregarDados();
        setError(null)
      } else {
        setError(response.error || 'Erro ao salvar culto');
      }

    } catch (err) {
      setError(err?.message || 'Erro ao salvar culto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (culto) => {
    if (!window.confirm(`Tem certeza que deseja excluir o culto "${culto.titulo}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await cultosService.excluir(culto.id);
      
      if (response.success) {
        carregarDados();
      } else {
        setError(response.error || 'Erro ao excluir culto');
      }

    } catch (err) {
      setError('Erro ao excluir culto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, culto = null) => {
    setModalType(type);
    setSelectedCulto(culto);
    
    if (culto && (type === 'edit' || type === 'view')) {
      setFormData({
        titulo: culto.titulo || '',
        descricao: culto.descricao || '',
        data_culto: culto.data_culto || '',
        horario_inicio: culto.horario_inicio || '',
        horario_fim: culto.horario_fim || '',
        local: culto.local || '',
        observacoes: culto.observacoes || '',
        tipo_culto_id: culto.tipo_culto_id || ''
      });
    } else {
      resetForm();
    }
    
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      data_culto: '',
      horario_inicio: '',
      horario_fim: '',
      local: '',
      observacoes: '',
      tipo_culto_id: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.nome) {
      case 'Planejado':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'Em Andamento':
        return <PlayCircle className="w-4 h-4 text-green-500" />;
      case 'Finalizado':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'Cancelado':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarHorario = (horario) => {
    return horario ? horario.substring(0, 5) : '';
  };

  if (loading && cultos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Cultos</h1>
          <p className="text-gray-600">Organize e gerencie os cultos da igreja</p>
        </div>
        
        {hasPermission('create_cultos') && (
          <button
            onClick={() => openModal('create')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Culto
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Título, descrição ou local..."
                value={filtros.busca}
                onChange={(e) => handleFiltroChange('busca', e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <input
              type="date"
              value={filtros.data_inicio}
              onChange={(e) => handleFiltroChange('data_inicio', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim
            </label>
            <input
              type="date"
              value={filtros.data_fim}
              onChange={(e) => handleFiltroChange('data_fim', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Culto
            </label>
            <select
              value={filtros.tipo_culto_id}
              onChange={(e) => handleFiltroChange('tipo_culto_id', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Todos os tipos</option>
              {tiposCultos.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Culto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cultos.map((culto) => (
                <tr key={culto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {culto.titulo}
                      </div>
                      {culto.descricao && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {culto.descricao}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatarData(culto.data_culto)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {formatarHorario(culto.horario_inicio)}
                      {culto.horario_fim && ` - ${formatarHorario(culto.horario_fim)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${culto.tipoCulto?.cor}20`,
                        color: culto.tipoCulto?.cor
                      }}
                    >
                      {culto.tipoCulto?.nome}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(culto.status)}
                      <span className="text-sm text-gray-900">
                        {culto.status?.nome}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {culto.local && (
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {culto.local}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal('view', culto)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {hasPermission('update_cultos') && (
                        <button
                          onClick={() => openModal('edit', culto)}
                          className="text-blue-400 hover:text-blue-600 p-1"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      
                      {hasPermission('delete_cultos') && (
                        <button
                          onClick={() => handleExcluir(culto)}
                          className="text-red-400 hover:text-red-600 p-1"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginacao.pages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {((paginacao.page - 1) * paginacao.limit) + 1} a{' '}
              {Math.min(paginacao.page * paginacao.limit, paginacao.total)} de{' '}
              {paginacao.total} resultados
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPaginacao(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!paginacao.hasPrev}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginacao(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!paginacao.hasNext}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalType === 'create' && 'Novo Culto'}
                {modalType === 'edit' && 'Editar Culto'}
                {modalType === 'view' && 'Detalhes do Culto'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    disabled={modalType === 'view'}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formData.data_culto}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_culto: e.target.value }))}
                    disabled={modalType === 'view'}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Culto *
                  </label>
                  <select
                    value={formData.tipo_culto_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipo_culto_id: e.target.value }))}
                    disabled={modalType === 'view'}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="">Selecione o tipo</option>
                    {tiposCultos.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário Início *
                  </label>
                  <input
                    type="time"
                    value={formData.horario_inicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, horario_inicio: e.target.value }))}
                    disabled={modalType === 'view'}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário Fim
                  </label>
                  <input
                    type="time"
                    value={formData.horario_fim}
                    onChange={(e) => setFormData(prev => ({ ...prev, horario_fim: e.target.value }))}
                    disabled={modalType === 'view'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local
                  </label>
                  <input
                    type="text"
                    value={formData.local}
                    onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
                    disabled={modalType === 'view'}
                    placeholder="Ex: Templo Principal, Salão de Eventos..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    disabled={modalType === 'view'}
                    rows={3}
                    placeholder="Descrição do culto..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                    disabled={modalType === 'view'}
                    rows={2}
                    placeholder="Observações adicionais..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              {modalType !== 'view' && (
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cultos;

