
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Sector,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryPieChartProps {
  reportsByCategory: CategoryData[];
  activeIndex?: number;
  selectedCategories: string[];
  onPieEnter: (_: any, index: number) => void;
  onPieLeave: () => void;
  onPieClick: (_: any, index: number) => void;
}

const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload, value, fill } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const textAnchor = x > cx ? 'start' : 'end';
  return (
    <g>
      <path 
        d={`M${cx + outerRadius * Math.cos(-midAngle * RADIAN)},${cy + outerRadius * Math.sin(-midAngle * RADIAN)}L${x},${y}`} 
        stroke={fill} 
        fill="none" 
      />
      <text 
        x={x} 
        y={y} 
        fill={fill} 
        textAnchor={textAnchor} 
        dominantBaseline="middle"
        style={{ fontSize: '12px', fontWeight: 500 }}
      >
        <tspan x={x} dy="0">{payload.name}</tspan>
        <tspan x={x} dy="15">{value} ({(percent * 100).toFixed(1)}%)</tspan>
      </text>
    </g>
  );
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="filter drop-shadow-lg"
      />
      
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="none"
        stroke={fill}
        strokeWidth={2}
        strokeOpacity={0.7}
      />
    </g>
  );
};

const CategoryPieChart = ({
  reportsByCategory,
  activeIndex,
  selectedCategories,
  onPieEnter,
  onPieLeave,
  onPieClick
}: CategoryPieChartProps) => {
  const getActiveIndices = () => {
    if (!selectedCategories.length) return [];
    
    return reportsByCategory
      .map((cat, index) => ({ index, name: cat.name }))
      .filter(item => selectedCategories.includes(item.name))
      .map(item => item.index);
  };

  const renderCenterLabel = () => {
    const activeIndices = getActiveIndices();
    const totalCount = reportsByCategory.reduce((sum, cat) => sum + cat.value, 0);
    
    if (activeIndices.length === 0) {
      return (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-base font-medium">
          <tspan x="50%" dy="-10">Categorías</tspan>
          <tspan x="50%" dy="25" className="text-sm text-muted-foreground">Seleccione una o más</tspan>
        </text>
      );
    }
    
    if (activeIndices.length === 1) {
      const category = reportsByCategory[activeIndices[0]];
      const categoryColor = COLORS[activeIndices[0] % COLORS.length];
      
      return (
        <>
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-base font-medium" fill={categoryColor}>
            <tspan x="50%" dy="-20">{category.name}</tspan>
            <tspan x="50%" dy="25" className="text-sm">{category.value} reportes</tspan>
            <tspan x="50%" dy="20" className="text-xs text-muted-foreground">({(category.value / totalCount * 100).toFixed(1)}%)</tspan>
          </text>
        </>
      );
    }
    
    const selectedCats = activeIndices.map(idx => reportsByCategory[idx]);
    const totalSelected = selectedCats.reduce((sum, cat) => sum + cat.value, 0);
    const percentOfAll = (totalSelected / totalCount * 100).toFixed(1);
    
    return (
      <>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-base font-medium">
          <tspan x="50%" dy="-30" className="font-bold">{selectedCats.length} categorías</tspan>
          <tspan x="50%" dy="25" className="text-sm">{totalSelected} reportes</tspan>
          <tspan x="50%" dy="20" className="text-xs text-muted-foreground">({percentOfAll}% del total)</tspan>
        </text>
      </>
    );
  };
  
  return (
    <div className="flex-grow">
      <ResponsiveContainer width="100%" height="100%" minHeight={350}>
        <PieChart>
          <Pie
            data={reportsByCategory}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            activeIndex={getActiveIndices()}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onClick={onPieClick}
            label={renderCustomizedLabel}
            labelLine={true}
          >
            {reportsByCategory.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                style={{ 
                  cursor: 'pointer',
                  opacity: selectedCategories.length > 0 && !selectedCategories.includes(entry.name) ? 0.5 : 1 
                }}
                className="transition-all duration-200 hover:opacity-90"
              />
            ))}
          </Pie>
          <Tooltip />
          {renderCenterLabel()}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
