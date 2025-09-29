'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfileSchema } from '@/lib/validations';
import { User, Settings as SettingsIcon, Building, Globe } from 'lucide-react';

interface UserProfile {
  name?: string;
  companyType?: string;
  siren?: string;
  timezone: string;
  locale: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    companyType: '',
    siren: '',
    timezone: 'Europe/Paris',
    locale: 'fr-FR',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      // Initialize form with session data
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || '',
      }));
    }
  }, [status, router, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validate input
      const validatedFields = UserProfileSchema.safeParse(formData);
      if (!validatedFields.success) {
        setError('Veuillez vérifier vos informations');
        setIsSaving(false);
        return;
      }

      // TODO: Implement profile update API
      // const response = await fetch('/api/user/profile', {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(validatedFields.data),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Profil mis à jour avec succès');
    } catch (error) {
      setError('Une erreur est survenue');
    } finally {
      setIsSaving(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">
          Gérez vos préférences et informations de compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profil personnel
            </CardTitle>
            <CardDescription>
              Vos informations personnelles et de contact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom complet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={session.user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  L'email ne peut pas être modifié
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyType">Type d'entreprise</Label>
                <Select
                  value={formData.companyType}
                  onValueChange={(value) => handleSelectChange('companyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto-entrepreneur">Auto-entrepreneur</SelectItem>
                    <SelectItem value="EI">Entreprise Individuelle (EI)</SelectItem>
                    <SelectItem value="SASU">SASU</SelectItem>
                    <SelectItem value="EURL">EURL</SelectItem>
                    <SelectItem value="SARL">SARL</SelectItem>
                    <SelectItem value="SAS">SAS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siren">SIREN (optionnel)</Label>
                <Input
                  id="siren"
                  name="siren"
                  type="text"
                  value={formData.siren}
                  onChange={handleChange}
                  placeholder="123456789"
                  maxLength={9}
                />
                <p className="text-xs text-gray-500">
                  9 chiffres (optionnel, pour les exports)
                </p>
              </div>

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Préférences
            </CardTitle>
            <CardDescription>
              Vos préférences d'affichage et de localisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleSelectChange('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locale">Langue</Label>
                <Select
                  value={formData.locale}
                  onValueChange={(value) => handleSelectChange('locale', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr-FR">Français</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Informations du compte
          </CardTitle>
          <CardDescription>
            Détails de votre compte Kilométrik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Membre depuis</span>
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Email</span>
              <span className="text-sm font-medium">{session.user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Statut</span>
              <span className="text-sm font-medium text-green-600">Actif</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Gestion des données
          </CardTitle>
          <CardDescription>
            Contrôlez vos données personnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Exporter mes données</h4>
                <p className="text-sm text-gray-600">
                  Téléchargez une copie de toutes vos données
                </p>
              </div>
              <Button variant="outline" disabled>
                Exporter
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Supprimer mon compte</h4>
                <p className="text-sm text-gray-600">
                  Supprimez définitivement votre compte et toutes vos données
                </p>
              </div>
              <Button variant="outline" className="text-red-600 hover:text-red-700" disabled>
                Supprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

