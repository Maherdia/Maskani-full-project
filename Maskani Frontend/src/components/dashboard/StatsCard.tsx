import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard; 