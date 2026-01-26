"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { Hub } from '@/types/database';
import { useLanguage } from '@/components/language/LanguageContext';
import { toast } from 'sonner';
import { Plus, Warehouse, MapPin, Ruler, BatteryCharging, Clock, ShieldCheck } from 'lucide-react';

interface CreateHubDialogProps {
  onHubCreated: () => void;
}

export const CreateHubDialog = ({ onHubCreated }: CreateHubDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    latitude: 0,
    longitude: 0,
    capacity: 0,
    charging_stations: 0,
    operating_hours: '',
    low_emission_zone: false
  });
  const { t } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'latitude' || name === 'longitude' || name === 'capacity' || name === 'charging_stations' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      low_emission_zone: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('hubs')
        .insert([
          {
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success(t('Hub created successfully!'));
      setOpen(false);
      onHubCreated();

      // Reset form
      setFormData({
        name: '',
        location: '',
        latitude: 0,
        longitude: 0,
        capacity: 0,
        charging_stations: 0,
        operating_hours: '',
        low_emission_zone: false
      });

    } catch (err) {
      console.error('Error creating hub:', err);
      toast.error(t('Failed to create hub'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Warehouse className="h-4 w-4" />
          {t('Create Hub')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            {t('Create New Hub')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <Warehouse className="inline h-4 w-4 mr-1" />
                {t('Hub Name')}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Rome Central Hub"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="inline h-4 w-4 mr-1" />
                {t('Location')}
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Rome, Italy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="latitude">
                <MapPin className="inline h-4 w-4 mr-1" />
                {t('Latitude')}
              </Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                value={formData.latitude}
                onChange={handleInputChange}
                required
                step={0.000001}
                placeholder="41.9028"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">
                <MapPin className="inline h-4 w-4 mr-1" />
                {t('Longitude')}
              </Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                value={formData.longitude}
                onChange={handleInputChange}
                required
                step={0.000001}
                placeholder="12.4964"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">
                <Ruler className="inline h-4 w-4 mr-1" />
                {t('Capacity (TEU)')}
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                required
                min={0}
                placeholder="500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="charging_stations">
                <BatteryCharging className="inline h-4 w-4 mr-1" />
                {t('Charging Stations')}
              </Label>
              <Input
                id="charging_stations"
                name="charging_stations"
                type="number"
                value={formData.charging_stations}
                onChange={handleInputChange}
                required
                min={0}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operating_hours">
                <Clock className="inline h-4 w-4 mr-1" />
                {t('Operating Hours')}
              </Label>
              <Input
                id="operating_hours"
                name="operating_hours"
                value={formData.operating_hours}
                onChange={handleInputChange}
                placeholder="08:00 - 20:00"
              />
            </div>

            <div className="space-y-2 flex items-center gap-3">
              <Checkbox
                id="low_emission_zone"
                checked={formData.low_emission_zone}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="low_emission_zone" className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                {t('Low Emission Zone')}
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">🔄</span>
                  {t('loading')}
                </>
              ) : (
                <>
                  <Warehouse className="mr-2 h-4 w-4" />
                  {t('Create Hub')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}