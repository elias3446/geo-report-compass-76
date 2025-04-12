
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FilterX, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CategoryPieChart from "./charts/CategoryPieChart";

interface CategoryDistributionProps {
  reportsByCategory: Array<{ name: string; value: number }>;
  selectedCategories: string[];
  activeIndex?: number;
  onPieEnter: (_: any, index: number) => void;
  onPieLeave: () => void;
  onPieClick: (_: any, index: number) => void;
  clearAllSelectedCategories: () => void;
  handleExportCategoryData: () => void;
}

const CategoryDistribution = ({
  reportsByCategory,
  selectedCategories,
  activeIndex,
  onPieEnter,
  onPieLeave,
  onPieClick,
  clearAllSelectedCategories,
  handleExportCategoryData
}: CategoryDistributionProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>Reports by Category</CardTitle>
            <CardDescription>
              Distribution of reports across different categories
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategories.length > 0 && (
              <Badge 
                variant="outline" 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer flex items-center gap-1"
                onClick={clearAllSelectedCategories}
              >
                <span>
                  Filtering by: {selectedCategories.join(', ')}
                </span>
                <X className="h-3.5 w-3.5" />
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleExportCategoryData}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <CategoryPieChart
          reportsByCategory={reportsByCategory}
          activeIndex={activeIndex}
          selectedCategories={selectedCategories}
          onPieEnter={onPieEnter}
          onPieLeave={onPieLeave}
          onPieClick={onPieClick}
        />
        <div className="mt-4 text-center text-sm">
          <p className="text-muted-foreground mb-2">
            Click en una categoría para filtrar. Selecciona varias para comparar.
          </p>
          {selectedCategories.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearAllSelectedCategories}
              className="flex items-center"
            >
              <FilterX className="h-4 w-4 mr-2" />
              Clear category filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;
