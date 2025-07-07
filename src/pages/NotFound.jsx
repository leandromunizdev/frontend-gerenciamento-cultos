import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-red-600">404 - Página não encontrada</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            A rota que você tentou acessar não existe ou foi removida.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ir para o Início
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Voltar para página anterior
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
