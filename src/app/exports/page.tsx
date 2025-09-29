'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Car } from 'lucide-react';

interface Vehicle {
  id: string;
  label: string;
  fiscalHP: number;
  fuelType: string;
}

interface ExportJob {
  id: string;
  rangeFrom: string;
  rangeTo: string;
  format: string;
  status: string;
  url?: string;
  createdAt: string;
}

export default function ExportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [formData, setFormData] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    format: 'PDF',
    vehicleId: 'all',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchVehicles();
      fetchExportJobs();
    }
  }, [status, router]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExportJobs = async () => {
    try {
      // TODO: Implement export jobs API
      // const response = await fetch('/api/exports');
      // if (response.ok) {
      //   const data = await response.json();
      //   setExportJobs(data);
      // }
    } catch (error) {
      console.error('Error fetching export jobs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        vehicleId: formData.vehicleId === 'all' ? undefined : formData.vehicleId,
      };
      
      const response = await fetch('/api/exports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue');
      } else {
        // TODO: Handle successful export
        alert('Export en cours de génération...');
        fetchExportJobs();
      }
    } catch (error) {
      setError('Une erreur est survenue');
    } finally {
      setIsExporting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'Terminé';
      case 'PENDING':
        return 'En cours';
      case 'FAILED':
        return 'Échec';
      default:
        return status;
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Exports</h1>
        <p className="text-gray-600">
          Générez des rapports PDF ou CSV de vos trajets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Nouvel export
            </CardTitle>
            <CardDescription>
              Créez un rapport de vos trajets pour une période donnée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">Date de début</Label>
                  <Input
                    id="from"
                    name="from"
                    type="date"
                    value={formData.from}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">Date de fin</Label>
                  <Input
                    id="to"
                    name="to"
                    type="date"
                    value={formData.to}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Format d'export</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => handleSelectChange('format', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF (Recommandé)</SelectItem>
                    <SelectItem value="CSV">CSV (Données brutes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleId">Véhicule (optionnel)</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) => handleSelectChange('vehicleId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les véhicules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les véhicules</SelectItem>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isExporting} className="w-full">
                {isExporting ? 'Génération...' : 'Générer l\'export'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Exports rapides
            </CardTitle>
            <CardDescription>
              Générez rapidement des rapports pour des périodes courantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                setFormData(prev => ({
                  ...prev,
                  from: startOfMonth.toISOString().split('T')[0],
                  to: now.toISOString().split('T')[0],
                  vehicleId: 'all',
                }));
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Ce mois-ci
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                const now = new Date();
                const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                setFormData(prev => ({
                  ...prev,
                  from: startOfQuarter.toISOString().split('T')[0],
                  to: now.toISOString().split('T')[0],
                  vehicleId: 'all',
                }));
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Ce trimestre
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                const now = new Date();
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                setFormData(prev => ({
                  ...prev,
                  from: startOfYear.toISOString().split('T')[0],
                  to: now.toISOString().split('T')[0],
                  vehicleId: 'all',
                }));
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Cette année
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des exports</CardTitle>
          <CardDescription>
            Vos exports précédents et leur statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          {exportJobs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun export généré
              </h3>
              <p className="text-gray-600">
                Vos exports apparaîtront ici une fois générés
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {exportJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">
                        {new Date(job.rangeFrom).toLocaleDateString('fr-FR')} - {new Date(job.rangeTo).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {job.format} • {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(job.status)}>
                      {getStatusLabel(job.status)}
                    </Badge>
                    {job.status === 'DONE' && job.url && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Formats d'export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">PDF</h4>
              <p className="text-sm text-gray-600">
                Rapport formaté prêt pour votre comptable, avec totaux et détails par trajet.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">CSV</h4>
              <p className="text-sm text-gray-600">
                Données brutes pour import dans Excel ou autres outils comptables.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

