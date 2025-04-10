
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  User, 
  Shield, 
  MapPin,
  Save,
  Mail,
  Lock,
  Globe,
  Map,
  Eye,
  Sliders
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SettingsPage = () => {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>
      
      <Tabs defaultValue="account">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-64">
            <CardContent className="p-4">
              <TabsList className="flex flex-col h-auto space-y-1">
                <TabsTrigger 
                  value="account" 
                  className="justify-start w-full px-3"
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="justify-start w-full px-3"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="justify-start w-full px-3"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="map" 
                  className="justify-start w-full px-3"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Map Preferences
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>
          
          <div className="flex-1">
            <TabsContent value="account" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </label>
                        <Input id="name" defaultValue="John Doe" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="organization" className="text-sm font-medium">
                          Organization
                        </label>
                        <Input id="organization" defaultValue="Acme Inc." />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="jobTitle" className="text-sm font-medium">
                          Job Title
                        </label>
                        <Input id="jobTitle" defaultValue="GIS Specialist" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile</h3>
                    
                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </label>
                      <Textarea 
                        id="bio" 
                        rows={4}
                        defaultValue="Environmental scientist with over 5 years of experience in geographic information systems and spatial analysis. Specialized in coastal erosion monitoring and urban development impact assessment."
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Language
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Select your preferred language
                          </p>
                        </div>
                        <Select defaultValue="en">
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Time Zone
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Set your local time zone
                          </p>
                        </div>
                        <Select defaultValue="utc">
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="est">Eastern (EST)</SelectItem>
                            <SelectItem value="cst">Central (CST)</SelectItem>
                            <SelectItem value="mst">Mountain (MST)</SelectItem>
                            <SelectItem value="pst">Pacific (PST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Control what notifications you receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Report Updates
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails when reports are updated
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            New Reports
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails when new reports are created
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Status Changes
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails when report statuses change
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Newsletter
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Receive our monthly newsletter
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">In-App Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Report Comments
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Show notifications for comments on reports
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Mentions
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Show notifications when you're mentioned
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Task Assignments
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Show notifications for new task assignments
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="current-password" className="text-sm font-medium">
                          Current Password
                        </label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="new-password" className="text-sm font-medium">
                          New Password
                        </label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium">
                          Confirm New Password
                        </label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">
                          Enable Two-Factor Authentication
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sessions</h3>
                    
                    <div className="rounded-md border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">Last active: Just now</p>
                          <p className="text-sm text-muted-foreground">Chrome on Windows</p>
                        </div>
                        <div className="flex h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    
                    <Button variant="outline">Log Out of All Sessions</Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="map" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Map Preferences</CardTitle>
                  <CardDescription>
                    Customize your map view and data visualization settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Map Display</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Default Map Style
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Choose your preferred map style
                          </p>
                        </div>
                        <Select defaultValue="satellite">
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="satellite">Satellite</SelectItem>
                            <SelectItem value="terrain">Terrain</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Default Region
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Set your default map view region
                          </p>
                        </div>
                        <Select defaultValue="na">
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="global">Global</SelectItem>
                            <SelectItem value="na">North America</SelectItem>
                            <SelectItem value="sa">South America</SelectItem>
                            <SelectItem value="eu">Europe</SelectItem>
                            <SelectItem value="as">Asia</SelectItem>
                            <SelectItem value="af">Africa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Show Labels
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Display location labels on map
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Show Terrain
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Display terrain features on map
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Visualization</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Color Scheme
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Select your preferred data visualization colors
                          </p>
                        </div>
                        <Select defaultValue="blue">
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select scheme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="rainbow">Rainbow</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Heat Map Opacity
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Set the opacity level for heat maps
                          </p>
                        </div>
                        <Select defaultValue="75">
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select opacity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25%</SelectItem>
                            <SelectItem value="50">50%</SelectItem>
                            <SelectItem value="75">75%</SelectItem>
                            <SelectItem value="100">100%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">
                            Auto-refresh Data
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Automatically refresh map data
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
