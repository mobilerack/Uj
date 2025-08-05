
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export function ApiKeyDialog({ apiKey, setApiKey, onClose }) {
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(tempKey);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card neon-glow">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <Key className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="gradient-text">Sportmonks API Kulcs</CardTitle>
            <CardDescription>
              Add meg a Sportmonks API kulcsot az adatok eléréséhez
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="API kulcs..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="bg-background/50 border-white/20"
              />
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-300 mb-2">
                <strong>Hogyan szerezd be az API kulcsot:</strong>
              </p>
              <ol className="text-xs text-blue-200 space-y-1 list-decimal list-inside">
                <li>Regisztrálj a Sportmonks oldalán</li>
                <li>Válaszd ki az ingyenes csomagot</li>
                <li>Másold ki az API kulcsot</li>
              </ol>
              <a
                href="https://www.sportmonks.com/football-api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-2"
              >
                Sportmonks API <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Mégse
              </Button>
              <Button
                onClick={handleSave}
                disabled={!tempKey.trim()}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Mentés
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
