import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, RotateCcw, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function FilterPanel({ 
  filters, 
  setFilters, 
  leagues, 
  teams, 
  onReset 
}) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 gradient-text">
            <Filter className="w-5 h-5" />
            Szűrők és keresés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Users className="w-4 h-4"/>
                Csapatok keresése
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Hazai csapat..."
                    value={filters.homeTeamSearch}
                    onChange={(e) => handleFilterChange('homeTeamSearch', e.target.value)}
                    className="pl-10 bg-background/50 border-white/20"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Vendég csapat..."
                    value={filters.awayTeamSearch}
                    onChange={(e) => handleFilterChange('awayTeamSearch', e.target.value)}
                    className="pl-10 bg-background/50 border-white/20"
                  />
                </div>
              </div>
            </div>


            <div className="space-y-2">
              <label className="text-sm font-medium">Bajnokság</label>
              <Select
                value={filters.league}
                onValueChange={(value) => handleFilterChange('league', value)}
              >
                <SelectTrigger className="bg-background/50 border-white/20">
                  <SelectValue placeholder="Válassz bajnokságot..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Összes bajnokság</SelectItem>
                  {leagues.map((league) => (
                    <SelectItem key={league.id} value={league.id.toString()}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Státusz</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger className="bg-background/50 border-white/20">
                      <SelectValue placeholder="Státusz..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Összes</SelectItem>
                      <SelectItem value="scheduled">Tervezett</SelectItem>
                      <SelectItem value="live">Élő</SelectItem>
                      <SelectItem value="finished">Befejezett</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Időszak</label>
                  <div className="flex gap-2">
                    <Select
                      value={filters.period}
                      onValueChange={(value) => handleFilterChange('period', value)}
                    >
                      <SelectTrigger className="bg-background/50 border-white/20 w-full">
                        <SelectValue placeholder="Időszak..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Ma</SelectItem>
                        <SelectItem value="tomorrow">Holnap</SelectItem>
                        <SelectItem value="week">E Hét</SelectItem>
                        <SelectItem value="all">Összes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
            </div>
            
            <div className="lg:col-span-3 md:col-span-2 flex justify-end">
                 <Button
                  variant="outline"
                  onClick={onReset}
                  className="shrink-0 bg-background/50 border-white/20 hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Szűrők törlése
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}