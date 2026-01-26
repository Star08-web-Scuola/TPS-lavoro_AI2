"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { supabase } from '@/integrations/supabase/client';
import { Shipment } from '@/types/database';
import { useLanguage } from '@/components/language/LanguageContext';
import { toast } from 'sonner';
import { Plus, PackagePlus, Truck, Train, Calendar, Clock, Weight, Volume2, Leaf } from 'lucide-react';

interface CreateShipmentDialogProps {
  onShipmentCreated: () => void;
}

export const CreateShipmentDialog = ({ onShipmentCreated }: CreateShipmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipment_number: '',
    origin: '',
    destination: '',
    rail_carrier: '',
    rail_departure_time: new Date(),
    rail_arrival_time: new Date(),
    last_mile_carrier: '',
    delivery_status: 'pending' as Shipment['delivery_status'],
    estimated_delivery_time: new Date(),
    weight_kg: 0,
    volume_m3: 0,
    co2_savings_kg: 0
  });
  const { t } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('kg') || name.includes('m3') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [name]: date
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('shipments')
        .insert([
          {
            ...formData,
            rail_departure_time: formData.rail_departure_time.toISOString(),
            rail_arrival_time: formData.rail_arrival_time.toISOString(),
            estimated_delivery_time: formData.estimated_delivery_time.toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success(t('Shipment created successfully!'));
      setOpen(false);
      onShipmentCreated();

      // Reset form
      setFormData({
        shipment_number: '',
        origin: '',
        destination: '',
        rail_carrier: '',
        rail_departure_time: new Date(),
        rail_arrival_time: new Date(),
        last_mile_carrier: '',
        delivery_status: 'pending',
        estimated_delivery_time: new Date(),
        weight_kg: 0,
        volume_m3: 0,
        co2_savings_kg: 0
      });

    } catch (err) {
      console.error('Error creating shipment:', err);
      toast.error(t('Failed to create shipment'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PackagePlus className="h-4 w-4" />
          {t('Create Shipment')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5" />
            {t('Create New Shipment')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipment_number">
                <Truck className="inline h-4 w-4 mr-1" />
                {t('Shipment Number')}
              </Label>
              <Input
                id="shipment_number"
                name="shipment_number"
                value={formData.shipment_number}
                onChange={handleInputChange}
                required
                placeholder="SHIP-2024-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">
                <MapPin className="inline h-4 w-4 mr-1" />
                {t('Origin')}
              </Label>
              <Input
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                required
                placeholder="Rome, Italy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">
                <MapPin className="inline h-4 w-4 mr-1" />
                {t('Destination')}
              </Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
                placeholder="Milan, Italy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rail_carrier">
                <Train className="inline h-4 w-4 mr-1" />
                {t('Rail Carrier')}
              </Label>
              <Input
                id="rail_carrier"
                name="rail_carrier"
                value={formData.rail_carrier}
                onChange={handleInputChange}
                required
                placeholder="Trenitalia Cargo"
              />
            </div>

            <div className="space-y-2">
              <Label>
                <Calendar className="inline h-4 w-4 mr-1" />
                {t('Rail Departure Time')}
              </Label>
              <DatePicker
                selected={formData.rail_departure_time}
                onChange={(date) => handleDateChange('rail_departure_time', date)}
                showTimeSelect
                dateFormat="Pp"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>
                <Calendar className="inline h-4 w-4 mr-1" />
                {t('Rail Arrival Time')}
              </Label>
              <DatePicker
                selected={formData.rail_arrival_time}
                onChange={(date) => handleDateChange('rail_arrival_time', date)}
                showTimeSelect
                dateFormat="Pp"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_mile_carrier">
                <Truck className="inline h-4 w-4 mr-1" />
                {t('Last Mile Carrier')}
              </Label>
              <Input
                id="last_mile_carrier"
                name="last_mile_carrier"
                value={formData.last_mile_carrier}
                onChange={handleInputChange}
                placeholder="GreenPath Delivery"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_status">
                <Truck className="inline h-4 w-4 mr-1" />
                {t('Delivery Status')}
              </Label>
              <Select
                value={formData.delivery_status}
                onValueChange={(value) => handleSelectChange('delivery_status', value as Shipment['delivery_status'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('Pending')}</SelectItem>
                  <SelectItem value="in_transit">{t('In Transit')}</SelectItem>
                  <SelectItem value="at_hub">{t('At Hub')}</SelectItem>
                  <SelectItem value="out_for_delivery">{t('Out for Delivery')}</SelectItem>
                  <SelectItem value="delivered">{t('Delivered')}</SelectItem>
                  <SelectItem value="delayed">{t('Delayed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                <Clock className="inline h-4 w-4 mr-1" />
                {t('Estimated Delivery Time')}
              </Label>
              <DatePicker
                selected={formData.estimated_delivery_time}
                onChange={(date) => handleDateChange('estimated_delivery_time', date)}
                showTimeSelect
                dateFormat="Pp"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight_kg">
                <Weight className="inline h-4 w-4 mr-1" />
                {t('Weight (kg)')}
              </Label>
              <Input
                id="weight_kg"
                name="weight_kg"
                type="number"
                value={formData.weight_kg}
                onChange={handleInputChange}
                required
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume_m3">
                <Volume2 className="inline h-4 w-4 mr-1" />
                {t('Volume (m³)')}
              </Label>
              <Input
                id="volume_m3"
                name="volume_m3"
                type="number"
                value={formData.volume_m3}
                onChange={handleInputChange}
                required
                min={0}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="co2_savings_kg">
                <Leaf className="inline h-4 w-4 mr-1" />
                {t('CO₂ Savings (kg)')}
              </Label>
              <Input
                id="co2_savings_kg"
                name="co2_savings_kg"
                type="number"
                value={formData.co2_savings_kg}
                onChange={handleInputChange}
                required
                min={0}
              />
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
                  <PackagePlus className="mr-2 h-4 w-4" />
                  {t('Create Shipment')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}