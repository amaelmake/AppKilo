'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Car, 
  Euro, 
  Calendar,
  Plus,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalKm: number;
  estimatedEUR: number;
  tripsCount: number;
  lastTrip?: {
    date: string;
    from: string;
    to: string;
    distance: number;
  };
}

interface WeeklyStats {
  week: string;
  km: number;
  trips: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch trips for current month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const response = await fetch(
        `/api/trips?from=${startOfMonth.toISOString()}&to=${endOfMonth.toISOString()}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const trips = data.trips || [];
        
        // Calculate stats
        const totalKm = trips.reduce((sum: number, trip: any) => 
          sum + (trip.roundTrip ? trip.distanceKm * 2 : trip.distanceKm), 0
        );
        const estimatedEUR = trips.reduce((sum: number, trip: any) => 
          sum + trip.amountEUR, 0
        );
        const tripsCount = trips.length;
        const lastTrip = trips[0] ? {
          date: new Date(trips[0].date).toLocaleDateString('fr-FR'),
          from: trips[0].startAddr,
          to: trips[0].endAddr,
          distance: trips[0].distanceKm
        } : undefined;

        setStats({
          totalKm: Math.round(totalKm * 100) / 100,
          estimatedEUR: Math.round(estimatedEUR * 100) / 100,
          tripsCount,
          lastTrip
        });

        // Calculate weekly stats (last 8 weeks)
        const weeklyData: WeeklyStats[] = [];
        for (let i = 7; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - (i * 7 + 6));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);

          const weekTrips = trips.filter((trip: any) => {
            const tripDate = new Date(trip.date);
            return tripDate >= weekStart && tripDate <= weekEnd;
          });

          const weekKm = weekTrips.reduce((sum: number, trip: any) => 
            sum + (trip.roundTrip ? trip.distanceKm * 2 : trip.distanceKm), 0
          );

          weeklyData.push({
            week: weekStart.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
            km: Math.round(weekKm * 100) / 100,
            trips: weekTrips.length
          });
        }

        setWeeklyStats(weeklyData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour {session.user?.name || 'Utilisateur'} 👋
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de vos trajets professionnels ce mois-ci
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/trips/new">
            <Button className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau trajet
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kilomètres</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalKm || 0} km
            </div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimation</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.estimatedEUR || 0} €
            </div>
            <p className="text-xs text-muted-foreground">
              Indemnités kilométriques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trajets</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.tripsCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernier trajet</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.lastTrip ? stats.lastTrip.date : 'Aucun'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.lastTrip ? `${stats.lastTrip.distance} km` : 'Aucun trajet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité hebdomadaire</CardTitle>
            <CardDescription>
              Kilomètres parcourus par semaine (8 dernières semaines)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyStats.map((week, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium">{week.week}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">
                      {week.trips} trajet{week.trips > 1 ? 's' : ''}
                    </Badge>
                    <span className="text-sm font-medium">{week.km} km</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/trips/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un trajet
              </Button>
            </Link>
            <Link href="/vehicles" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Car className="w-4 h-4 mr-2" />
                Gérer mes véhicules
              </Button>
            </Link>
            <Link href="/exports" className="block">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Exporter mes données
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trips */}
      {stats?.lastTrip && (
        <Card>
          <CardHeader>
            <CardTitle>Dernier trajet</CardTitle>
            <CardDescription>
              Votre trajet le plus récent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{stats.lastTrip.from}</p>
                <p className="text-sm text-gray-600">→ {stats.lastTrip.to}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{stats.lastTrip.distance} km</p>
                <p className="text-sm text-gray-600">{stats.lastTrip.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

