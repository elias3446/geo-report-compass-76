
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SystemSetting } from '../../types/admin';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/components/ui/use-toast";
import { registerAdminActivity } from '@/services/activityService';

interface SettingsFormProps {
  settings: SystemSetting[];
  onSave: (settings: SystemSetting[]) => void;
  currentUser?: { id: string; name: string }; // Usuario actual para el registro de actividad
}

interface GroupedSettings {
  [key: string]: SystemSetting[];
}

const SettingsForm: React.FC<SettingsFormProps> = ({ 
  settings, 
  onSave,
  currentUser = { id: 'admin', name: 'Administrador' } // Valor por defecto 
}) => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const form = useForm();
  
  // Group settings by their group property
  const groupedSettings = settings.reduce<GroupedSettings>((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = [];
    }
    acc[setting.group].push(setting);
    return acc;
  }, {});
  
  // Get unique groups for tabs
  const groups = Object.keys(groupedSettings);
  
  const handleSubmit = () => {
    // Registrar la actividad
    registerAdminActivity({
      type: 'setting_updated',
      title: 'Configuración actualizada',
      description: `Se ha actualizado la configuración del grupo "${activeTab}"`,
      userId: currentUser.id,
      userName: currentUser.name
    });
    
    // Llamar a la función original
    onSave(settings);
    
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido guardados correctamente.",
    });
  };
  
  const renderSettingInput = (setting: SystemSetting) => {
    // Determine the input type based on the setting key or value
    if (setting.key.includes('enable') || setting.key.includes('active') || 
        setting.value === 'true' || setting.value === 'false') {
      const isChecked = setting.value === 'true';
      return (
        <FormField
          key={setting.id}
          name={setting.id}
          render={() => (
            <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
              <div>
                <FormLabel className="text-base">{setting.description}</FormLabel>
                <FormDescription>{setting.key}</FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={isChecked} 
                  onCheckedChange={(checked) => {
                    setting.value = checked ? 'true' : 'false';
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      );
    } else if (setting.description.toLowerCase().includes('descripción')) {
      return (
        <FormField
          key={setting.id}
          name={setting.id}
          render={() => (
            <FormItem>
              <FormLabel>{setting.description}</FormLabel>
              <FormControl>
                <Textarea 
                  defaultValue={setting.value} 
                  onChange={(e) => {
                    setting.value = e.target.value;
                  }}
                />
              </FormControl>
              <FormDescription>{setting.key}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    } else {
      return (
        <FormField
          key={setting.id}
          name={setting.id}
          render={() => (
            <FormItem>
              <FormLabel>{setting.description}</FormLabel>
              <FormControl>
                <Input 
                  defaultValue={setting.value} 
                  onChange={(e) => {
                    setting.value = e.target.value;
                  }}
                />
              </FormControl>
              <FormDescription>{setting.key}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {groups.map(group => (
              <TabsTrigger key={group} value={group} className="capitalize">
                {group}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {groups.map(group => (
            <TabsContent key={group} value={group}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{group}</CardTitle>
                  <CardDescription>
                    Configuración relacionada con {group}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groupedSettings[group].map(renderSettingInput)}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Guardar Configuración</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </form>
    </Form>
  );
};

export default SettingsForm;
