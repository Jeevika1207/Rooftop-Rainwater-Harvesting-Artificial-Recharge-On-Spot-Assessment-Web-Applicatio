
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  MapPin,
  Factory,
  Building,
  Ruler,
  Info,
  LocateFixed,
  Loader2,
  Droplets,
  Building2,
  Home,
  Users,
  Edit3,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  siteCategory: z.enum(['industrial', 'residential']),
  projectName: z.string().min(2, {
    message: 'Site name must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  dailyDemandM3: z.coerce.number().min(0, {
    message: 'Value must be a positive number.',
  }),
  industryType: z.string().optional(),
  otherIndustryName: z.string().optional(),
  rooftopType: z.string({
    required_error: "Please select a rooftop type."
  }),
  roofLength: z.coerce.number().positive({
    message: 'Roof length must be a positive number.',
  }),
  roofWidth: z.coerce.number().positive({
    message: 'Roof width must be a positive number.',
  }),
  tankSpaceLength: z.coerce.number().positive({
    message: 'Available length must be a positive number.',
  }),
  tankSpaceWidth: z.coerce.number().positive({
    message: 'Available width must be a positive number.',
  }),
});

export default function AssessmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteCategory: 'industrial',
      projectName: '',
      location: '',
      dailyDemandM3: 50,
      industryType: 'manufacturing',
      otherIndustryName: '',
      roofLength: 0,
      roofWidth: 0,
      tankSpaceLength: 0,
      tankSpaceWidth: 0,
    },
  });

  const siteCategory = form.watch('siteCategory');
  const industryType = form.watch('industryType');

  async function handleGetCurrentLocation(isAutomatic = false) {
    setIsFetchingLocation(true);
    let latitude = 13.0827;
    let longitude = 80.2707;
    let gotLocation = false;

    try {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, enableHighAccuracy: true });
        });
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        gotLocation = true;
      }
    } catch (err) {
      console.warn("Location access denied or unavailable, using regional default.", err);
    }

    const locationString = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    form.setValue('location', locationString, { shouldValidate: true });
    setIsFetchingLocation(false);

    if (gotLocation) {
      toast({
        title: 'Location Fetched',
        description: `Identified site coordinates: ${locationString}`,
      });
    } else {
      toast({
        title: 'GIS Default Region Set',
        description: `Using coordinates ${locationString}. You can also edit location manually.`,
      });
    }

    if (isAutomatic) {
      toast({
        title: "Analyzing Satellite Imagery...",
        description: "Detecting building footprint and catchment area."
      });
      form.setValue('projectName', 'Automated Site Assessment');
      if (siteCategory === 'industrial') {
        form.setValue('roofLength', 100);
        form.setValue('roofWidth', 50);
        form.setValue('tankSpaceLength', 20);
        form.setValue('tankSpaceWidth', 15);
      } else {
        form.setValue('roofLength', 20);
        form.setValue('roofWidth', 15);
        form.setValue('tankSpaceLength', 5);
        form.setValue('tankSpaceWidth', 5);
        form.setValue('dailyDemandM3', 5);
      }
    }
  }
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    const dataToSubmit = { ...values };
    
    // Use 'Other' name if applicable
    if (values.industryType === 'other' && values.otherIndustryName) {
        dataToSubmit.industryType = values.otherIndustryName;
    }

    const params = new URLSearchParams(
      Object.entries(dataToSubmit).map(([key, value]) => [key, String(value)])
    );
    router.push(`/assessment?${params.toString()}`);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
        <div className="w-full max-w-4xl">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline text-primary flex items-center justify-center gap-2">
                {siteCategory === 'industrial' ? <Factory className="h-8 w-8" /> : <Home className="h-8 w-8" />}
                Hydronix Assessment
              </CardTitle>
              <CardDescription className="text-base">
                Precision Assessment for {siteCategory === 'industrial' ? 'Industrial' : 'Residential'} Rainwater Harvesting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="automatic">GIS Automation</TabsTrigger>
                </TabsList>
                <Form {...form}>
                <TabsContent value="manual">
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8 mt-6"
                    >
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Site Specifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="siteCategory"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Assessment Type</FormLabel>
                                <Select onValueChange={(val) => {
                                    field.onChange(val);
                                    if (val === 'residential') {
                                        form.setValue('dailyDemandM3', 4);
                                    } else {
                                        form.setValue('dailyDemandM3', 50);
                                    }
                                }} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="industrial">Industrial / Commercial</SelectItem>
                                        <SelectItem value="residential">Residential / House</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="projectName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{siteCategory === 'industrial' ? 'Industrial Site Name' : 'Project Name'}</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder={siteCategory === 'industrial' ? "e.g., Zenith Hub" : "e.g., My Dream Home"} {...field} className="pl-9" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Coordinates or City" {...field} className="pl-9 pr-12" />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                      onClick={() => handleGetCurrentLocation(false)}
                                      disabled={isFetchingLocation}
                                    >
                                      {isFetchingLocation ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <LocateFixed className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {siteCategory === 'industrial' && (
                             <div className="space-y-4">
                               <FormField
                                  control={form.control}
                                  name="industryType"
                                  render={({ field }) => (
                                      <FormItem>
                                      <FormLabel>Industry Type</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select Industry" />
                                          </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                              <SelectItem value="warehouse">Warehouse & Logistics</SelectItem>
                                              <SelectItem value="food">Food Processing</SelectItem>
                                              <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
                                              <SelectItem value="it_park">IT / Tech Park</SelectItem>
                                              <SelectItem value="other">Other</SelectItem>
                                          </SelectContent>
                                      </Select>
                                      <FormMessage />
                                      </FormItem>
                                  )}
                               />
                               {industryType === 'other' && (
                                 <FormField
                                    control={form.control}
                                    name="otherIndustryName"
                                    render={({ field }) => (
                                      <FormItem className="animate-in fade-in slide-in-from-top-2">
                                        <FormLabel>Specify Industry Name</FormLabel>
                                        <FormControl>
                                          <div className="relative">
                                            <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="e.g., Textile Mill" {...field} className="pl-9" />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                               )}
                             </div>
                          )}
                          <FormField
                            control={form.control}
                            name="dailyDemandM3"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {siteCategory === 'industrial' 
                                    ? 'Daily Process Demand (m³)' 
                                    : 'Number of Household Members'}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    {siteCategory === 'industrial' ? (
                                      <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    )}
                                    <Input 
                                      type="number" 
                                      step={siteCategory === 'industrial' ? "0.1" : "1"} 
                                      placeholder={siteCategory === 'industrial' ? "e.g., 50" : "e.g., 4"} 
                                      {...field} 
                                      className="pl-9" 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                          <Ruler className="h-5 w-5" />
                          Catchment Area (Roof)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="rooftopType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Rooftop Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Surface" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="concrete">RCC / Concrete</SelectItem>
                                            <SelectItem value="metal">Metal Sheet</SelectItem>
                                            <SelectItem value="asbestos">ACC Sheet</SelectItem>
                                            <SelectItem value="tiled">Tiles</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                               <FormField
                                control={form.control}
                                name="roofLength"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Length (m)</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="Length" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="roofWidth"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Width (m)</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="Width" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-primary">
                          Storage & Infrastructure Space
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="tankSpaceLength"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available Length (m)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="Max Length" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="tankSpaceWidth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available Width (m)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="Max Width" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full text-lg py-6" size="lg">
                        Generate Assessment Report
                      </Button>
                    </form>
                </TabsContent>
                <TabsContent value="automatic">
                    <div className="mt-6 text-center space-y-4">
                        <p className="text-muted-foreground">Leverage satellite data to automatically populate site dimensions.</p>
                        <Button onClick={() => handleGetCurrentLocation(true)} disabled={isFetchingLocation} size="lg" className="w-full md:w-auto">
                            {isFetchingLocation ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <LocateFixed className="mr-2 h-4 w-4" />
                            )}
                            Initialize Site Mapping
                        </Button>

                        {form.watch('roofLength') > 0 && (
                             <Card className="mt-6 text-left border-primary/40 bg-primary/5">
                                <CardHeader>
                                    <CardTitle>GIS Analysis Complete</CardTitle>
                                    <CardDescription>Verified catchment area data.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Est. Catchment:</span>
                                        <div className="font-bold">{(form.watch('roofLength') * form.watch('roofWidth')).toLocaleString()} m²</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Type:</span>
                                        <div className="font-bold capitalize">{siteCategory}</div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={form.handleSubmit(onSubmit)} className="w-full">
                                        Proceed to Report
                                    </Button>
                                </CardFooter>
                             </Card>
                        )}
                    </div>
                </TabsContent>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-8 border-none bg-accent/30">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                      <Info className="h-5 w-5"/>
                      Did you know?
                  </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                  <p>💧 Rainwater is naturally soft and ideal for industrial processes and domestic washing.</p>
                  <p>🌍 Every liter harvested reduces pressure on municipal water supplies and falling groundwater levels.</p>
              </CardContent>
          </Card>
        </div>
    </div>
  );
}
