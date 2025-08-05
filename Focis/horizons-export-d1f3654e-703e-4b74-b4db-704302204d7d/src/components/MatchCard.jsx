
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function MatchCard({ match, index }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'finished': return 'bg-green-500';
      case 'live': return 'bg-red-500 pulse-animation';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'finished': return 'Befejezett';
      case 'live': return 'Élő';
      case 'scheduled': return 'Tervezett';
      default: return status || 'Ismeretlen';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="glass-card hover:neon-glow transition-all duration-300 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {match.league?.name || 'Ismeretlen bajnokság'}
              </span>
            </div>
            <Badge className={`${getStatusColor(match.state?.state)} text-white border-0`}>
              {getStatusText(match.state?.state)}
            </Badge>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img  
                  className="w-8 h-8 rounded-full object-cover"
                  alt="Home team logo"
                 src="https://images.unsplash.com/photo-1563382563342-db6825814fdc" />
                <span className="font-semibold">
                  {match.participants?.[0]?.name || 'Hazai csapat'}
                </span>
              </div>
            </div>

            <div className="px-4">
              <div className="text-2xl font-bold text-center gradient-text">
                {match.scores?.[0]?.score?.goals || '0'} - {match.scores?.[1]?.score?.goals || '0'}
              </div>
            </div>

            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-semibold">
                  {match.participants?.[1]?.name || 'Vendég csapat'}
                </span>
                <img  
                  className="w-8 h-8 rounded-full object-cover"
                  alt="Away team logo"
                 src="https://images.unsplash.com/photo-1563382563342-db6825814fdc" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(match.starting_at)}</span>
            </div>
            
            {match.venue?.name && (
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{match.venue.name}</span>
              </div>
            )}
          </div>

          {match.predictions && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Előrejelzések</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-green-500/20 rounded">
                  <div className="font-medium">1</div>
                  <div className="text-muted-foreground">
                    {match.predictions?.home_win || 'N/A'}%
                  </div>
                </div>
                <div className="text-center p-2 bg-yellow-500/20 rounded">
                  <div className="font-medium">X</div>
                  <div className="text-muted-foreground">
                    {match.predictions?.draw || 'N/A'}%
                  </div>
                </div>
                <div className="text-center p-2 bg-red-500/20 rounded">
                  <div className="font-medium">2</div>
                  <div className="text-muted-foreground">
                    {match.predictions?.away_win || 'N/A'}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
