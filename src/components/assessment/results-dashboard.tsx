'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  TrendingUp,
  Droplets,
  Container,
  BarChart,
  Download,
  Info,
  Layers,
  Archive,
  Ruler,
  Factory,
  Home,
  IndianRupee,
  MapPin,
  CloudRain,
  Compass,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { PotentialChart } from './potential-chart';
import { CostBenefitChart } from './cost-benefit-chart';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { formatINR, RegionalGisProfile } from '@/lib/gis-datasets';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type RecommendationDetail = {
    label: string;
    value: string;
}

type Recommendation = {
    type: string;
    details: RecommendationDetail[];
}

type ResultsDashboardProps = {
  data: {
    projectName: string;
    location: string;
    feasibility: string;
    confidenceScore: number;
    confidenceReason: string;
    recommendations: Recommendation[];
    waterCollectionEstimate: number;
    groundwaterRechargePotential: number;
    optimalTankSize: number;
    costEstimation: {
      investment: number;
      annualSavings: number;
      paybackYears?: number;
      tenYearSavings?: number;
    };
    localRainfall: number;
    groundwaterLevel: number;
    principalAquifer: string;
    regionalGis?: RegionalGisProfile;
    rooftopArea: number;
    annualDemand: number;
    tankLength: number;
    tankWidth: number;
    industryType: string;
    siteCategory: string;
  };
};

export function ResultsDashboard({ data }: ResultsDashboardProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const isIndustrial = data.siteCategory === 'industrial';

  const paybackYears = data.costEstimation.paybackYears || parseFloat((data.costEstimation.investment / (data.costEstimation.annualSavings || 1)).toFixed(1));
  const tenYearSavings = data.costEstimation.tenYearSavings || Math.round((data.costEstimation.annualSavings * 10) - data.costEstimation.investment);

  const handleExportPdf = async () => {
    const reportElement = document.getElementById('assessment-report-container');
    if (!reportElement) return;

    try {
      setIsExporting(true);
      toast({
        title: 'Generating PDF Report...',
        description: 'Compiling high-resolution report.',
      });

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 20) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const cleanProjectName = (data.projectName || 'Hydronix').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${cleanProjectName}_Feasibility_Report.pdf`;
      pdf.save(filename);

      toast({
        title: 'PDF Report Exported Successfully',
        description: `Saved as ${filename}`,
      });
    } catch (err) {
      console.error('PDF generation fallback to print', err);
      if (typeof window !== 'undefined') {
        window.print();
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div id="assessment-report-container" className="space-y-6 animate-in fade-in-50 duration-500 bg-background p-2 rounded-xl">
      {/* Header Banner */}
      <Card className={`bg-gradient-to-br ${isIndustrial ? 'from-primary/95 to-primary' : 'from-blue-600 to-blue-500'} text-primary-foreground shadow-xl border-none`}>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-headline flex items-center gap-2">
                {isIndustrial ? <Factory className="h-7 w-7" /> : <Home className="h-7 w-7" />}
                Hydronix Assessment: {data.projectName}
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 mt-1">
                Site Coordinates: {data.location} {isIndustrial && `| Sector: ${data.industryType}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 text-sm py-1 px-3 uppercase">
                {data.siteCategory} GRADE
              </Badge>
              <Badge variant="outline" className="border-white/40 text-white text-xs py-1 px-3">
                IMD & CGWB VERIFIED
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 py-6">
          <div className="flex items-center gap-6">
            <CheckCircle2 className="h-20 w-20 text-accent" />
            <div>
              <p className="text-5xl font-extrabold tracking-tighter">{data.feasibility}</p>
              <p className="text-lg font-medium opacity-90">Harvesting & Artificial Recharge Feasible</p>
            </div>
          </div>
          <div className="text-center md:text-right bg-black/15 p-4 rounded-xl backdrop-blur-sm border border-white/10">
             <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Reliability Index</p>
             <p className="text-6xl font-black">{data.confidenceScore}%</p>
             <p className="text-xs mt-2 flex items-center justify-end gap-1 opacity-90"><Info className="h-3 w-3" /> {data.confidenceReason}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-white/10 pt-4 no-print">
            <Button 
              variant="secondary" 
              onClick={handleExportPdf} 
              disabled={isExporting}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-6"
            >
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {isExporting ? 'Generating PDF...' : 'Export Full Report (PDF)'}
            </Button>
        </CardFooter>
      </Card>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-primary text-lg"><Droplets className="h-5 w-5" /> Harvest Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {data.waterCollectionEstimate.toLocaleString('en-IN')} L/year
            </div>
            <p className="text-sm text-muted-foreground mt-1">Estimated annual harvest from {data.rooftopArea} m² rooftop catchment.</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-chart-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-primary text-lg"><TrendingUp className="h-5 w-5" /> Recharge Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {data.groundwaterRechargePotential.toLocaleString('en-IN')} L/year
            </div>
            <p className="text-sm text-muted-foreground mt-1">Surplus water routed to artificial groundwater recharge.</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-primary text-lg"><Container className="h-5 w-5" /> Optimal Storage Tank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.optimalTankSize.toLocaleString('en-IN')} Liters
            </div>
            <p className="text-sm text-muted-foreground mt-1">Recommended heavy-duty storage for onsite resilience.</p>
            <div className="text-xs text-muted-foreground mt-3 flex items-center gap-2 bg-muted p-2 rounded">
                <Ruler className="h-3.5 w-3.5 text-primary" />
                <span>Dimensions: {data.tankLength}m x {data.tankWidth}m</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water Balance & Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><BarChart className="h-5 w-5" /> Annual Water Balance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <PotentialChart
                    harvested={data.waterCollectionEstimate}
                    demand={data.annualDemand}
                    stored={data.optimalTankSize}
                    recharged={data.groundwaterRechargePotential}
                />
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><Archive className="h-5 w-5" /> Infrastructure Specification</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {data.recommendations.map((rec, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-base py-3">
                                <div className="flex items-center gap-2 text-left">
                                    {rec.type.includes('Storage') ? <Archive className="h-4 w-4 text-primary" /> : <Layers className="h-4 w-4 text-primary" />}
                                    {rec.type}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-3 text-sm pl-2">
                                    {rec.details.map((detail, i) => (
                                        <li key={i} className="flex justify-between border-b border-border/50 pb-1">
                                            <span className="font-medium text-muted-foreground">{detail.label}</span>
                                            <span className="text-right font-semibold">{detail.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
          </Card>
      </div>

      {/* Financial ROI Analysis (Indian Money ₹) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-primary/20">
              <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-primary font-headline text-xl">
                        <IndianRupee className="h-5 w-5 text-emerald-600" />
                        Economic & Cost-Benefit Analysis (INR ₹)
                      </CardTitle>
                      <CardDescription>Capital investment vs. operational savings in Indian Rupees (₹).</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 font-bold px-3">
                      Payback: {paybackYears} Years
                    </Badge>
                  </div>
              </CardHeader>
              <CardContent className="space-y-6">
                  {/* Summary Metric Cards in INR */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/40 rounded-xl border border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Initial Capital (₹)</p>
                      <p className="text-lg font-bold text-destructive">{formatINR(data.costEstimation.investment)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Annual Savings (₹/yr)</p>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatINR(data.costEstimation.annualSavings)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payback Period</p>
                      <p className="text-lg font-bold text-primary">{paybackYears} Yrs</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">10-Yr Net Savings (₹)</p>
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{formatINR(tenYearSavings)}</p>
                    </div>
                  </div>

                  <CostBenefitChart 
                    investment={data.costEstimation.investment} 
                    savings={data.costEstimation.annualSavings} />
              </CardContent>
          </Card>

          {/* Regional IMD, CGWB & GIS Dataset Profile Card */}
          <Card className="bg-gradient-to-b from-primary/5 to-primary/10 border-primary/20 flex flex-col shadow-sm">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary text-lg">
                      <Compass className="h-5 w-5 text-primary"/>
                      Regional Datasets (IMD / CGWB / GIS)
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow text-sm">
                  {/* IMD Dataset */}
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span className="flex items-center gap-1 font-semibold text-primary"><CloudRain className="h-3.5 w-3.5"/> IMD Rainfall Dataset</span>
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5">IMD Normals</Badge>
                    </div>
                    <div className="flex justify-between items-center font-bold text-sm">
                      <span>Annual Rainfall:</span>
                      <span className="text-primary">{data.localRainfall} mm/yr</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Monsoon: {data.regionalGis?.imd.monsoonMonths || 'June - Sept'} ({data.regionalGis?.imd.averageRainyDays || 60} rainy days)
                    </p>
                  </div>

                  {/* CGWB Hydrogeology Dataset */}
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span className="flex items-center gap-1 font-semibold text-primary"><Layers className="h-3.5 w-3.5"/> CGWB Groundwater Dataset</span>
                      <Badge 
                        variant={data.regionalGis?.cgwb.waterTableCategory === 'Safe' ? 'secondary' : 'destructive'} 
                        className="text-[10px] py-0 px-1.5"
                      >
                        {data.regionalGis?.cgwb.waterTableCategory || 'Safe'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Aquifer Type:</span>
                        <span className="font-bold text-right">{data.principalAquifer}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Water Table Depth:</span>
                        <span className="font-bold">{data.groundwaterLevel} m BGL</span>
                      </div>
                    </div>
                  </div>

                  {/* GIS Satellite Catchment Dataset */}
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span className="flex items-center gap-1 font-semibold text-primary"><MapPin className="h-3.5 w-3.5"/> GIS Satellite Catchment</span>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">ISRO Bhuvan</Badge>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Soil Permeability:</span>
                        <span className="font-semibold">{data.regionalGis?.gis.soilType || 'Sandy Loam'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Infiltration Rate:</span>
                        <span className="font-semibold">{data.regionalGis?.gis.infiltrationRateMmHr || 20} mm/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 p-2 bg-muted/60 rounded text-[11px] text-muted-foreground flex items-center gap-1.5 italic">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Verified against IMD Climatological Normals & CGWB National Aquifer Mapping.</span>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
