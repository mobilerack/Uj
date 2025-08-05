import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { ApiKeyDialog } from '@/components/ApiKeyDialog';
import { MatchCard } from '@/components/MatchCard';
import { FilterPanel } from '@/components/FilterPanel';
import { StatsPanel } from '@/components/StatsPanel';
import { useSportmonksApi } from '@/hooks/useSportmonksApi';
import { Settings, RefreshCw, TrendingUp, Loader2 } from 'lucide-react';

function App() {
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [matches, setMatches] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    homeTeamSearch: '',
    awayTeamSearch: '',
    league: 'all',
    status: 'all',
    period: 'today'
  });

  const { 
    apiKey, 
    setApiKey, 
    makeRequest, 
    getRemainingRequests, 
    getTimeUntilReset,
    canMakeRequest 
  } = useSportmonksApi();

  // Load initial data
  useEffect(() => {
    if (apiKey && canMakeRequest) {
      loadInitialData();
    }
  }, [apiKey, canMakeRequest]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (!apiKey) return;

    const interval = setInterval(() => {
      if (canMakeRequest) {
        loadMatches();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [apiKey, canMakeRequest]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadMatches(),
        loadLeagues()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async () => {
    const today = new Date().toISOString().split('T')[0];
    const data = await makeRequest('fixtures', {
      'filter[date]': today,
      include: 'participants,league,venue,scores,state'
    });

    if (data?.data) {
      setMatches(data.data);
      toast({
        title: "Adatok frissítve",
        description: `${data.data.length} meccs betöltve`
      });
    }
  };

  const loadLeagues = async () => {
    const data = await makeRequest('leagues', {
      include: 'country'
    });

    if (data?.data) {
      setLeagues(data.data.slice(0, 50)); // Limit to first 50 leagues
    }
  };

  const refreshData = async () => {
    if (!canMakeRequest) {
      toast({
        title: "Rate limit elérve",
        description: "Kérlek várj a következő frissítésig!",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    await loadMatches();
    setLoading(false);
  };

  const resetFilters = () => {
    setFilters({
      homeTeamSearch: '',
      awayTeamSearch: '',
      league: 'all',
      status: 'all',
      period: 'today'
    });
  };

  // Filter matches based on current filters
  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      // Home Team Search filter
      if (filters.homeTeamSearch) {
        const searchTerm = filters.homeTeamSearch.toLowerCase();
        const homeTeamName = match.participants?.[0]?.name?.toLowerCase() || '';
        if (!homeTeamName.includes(searchTerm)) {
          return false;
        }
      }

      // Away Team Search filter
      if (filters.awayTeamSearch) {
        const searchTerm = filters.awayTeamSearch.toLowerCase();
        const awayTeamName = match.participants?.[1]?.name?.toLowerCase() || '';
        if (!awayTeamName.includes(searchTerm)) {
          return false;
        }
      }

      // League filter
      if (filters.league !== 'all') {
        if (match.league?.id?.toString() !== filters.league) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all') {
        if (match.state?.state?.toLowerCase() !== filters.status) {
          return false;
        }
      }

      // Period filter
      if (filters.period !== 'all') {
        const matchDate = new Date(match.starting_at);
        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const matchDateOnly = new Date(matchDate);
        matchDateOnly.setHours(0,0,0,0);


        switch (filters.period) {
          case 'today':
            if (matchDateOnly.getTime() !== today.getTime()) {
              return false;
            }
            break;
          case 'tomorrow':
            if (matchDateOnly.getTime() !== tomorrow.getTime()) {
              return false;
            }
            break;
          case 'week':
            const weekFromNow = new Date(today);
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            if (matchDateOnly < today || matchDateOnly >= weekFromNow) {
              return false;
            }
            break;
        }
      }

      return true;
    });
  }, [matches, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="floating mb-6">
            <img  
              className="w-20 h-20 mx-auto rounded-full neon-glow"
              alt="Sports prediction app logo"
             src="https://images.unsplash.com/photo-1686061592689-312bbfb5c055" />
          </div>
          
          <h1 className="text-5xl font-bold gradient-text mb-4">
            SportPredict Pro
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Valós idejű sportesemény eredmények és előrejelzések
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => setShowApiDialog(true)}
              variant="outline"
              className="bg-background/50 border-white/20 hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              API Beállítások
            </Button>
            
            <Button
              onClick={refreshData}
              disabled={loading || !canMakeRequest}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Frissítés
            </Button>
          </div>
        </motion.div>

        {/* Stats Panel */}
        <StatsPanel
          remainingRequests={getRemainingRequests()}
          timeUntilReset={getTimeUntilReset()}
          totalMatches={matches.length}
          filteredMatches={filteredMatches.length}
        />

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          leagues={leagues}
          teams={teams}
          onReset={resetFilters}
        />

        {/* Matches Grid */}
        <div className="space-y-6">
          {loading && matches.length === 0 ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Adatok betöltése...</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Nincs találat</h3>
              <p className="text-muted-foreground mb-4">
                {!apiKey 
                  ? 'Add meg az API kulcsot az adatok betöltéséhez'
                  : 'Próbálj meg más szűrőket használni'
                }
              </p>
              {!apiKey && (
                <Button
                  onClick={() => setShowApiDialog(true)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  API Kulcs Beállítása
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredMatches.map((match, index) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* API Key Dialog */}
        <AnimatePresence>
          {showApiDialog && (
            <ApiKeyDialog
              apiKey={apiKey}
              setApiKey={setApiKey}
              onClose={() => setShowApiDialog(false)}
            />
          )}
        </AnimatePresence>
      </div>

      <Toaster />
    </div>
  );
}

export default App;