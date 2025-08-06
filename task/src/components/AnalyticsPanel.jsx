import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, Clock, Users, TrendingUp } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch backend summary
  useEffect(() => {
    fetch('http://localhost:5000/api/analytics/summary') // ✅ your backend URL
      .then((res) => res.json())
      .then((summary) => {
        setData({
          totalScans: summary.scans,
          uniqueUsers: Math.floor(summary.scans * 0.82), // optional logic
          averageTime: `${summary.avgTime} sec`,
          conversionRate: 12.5, // example static value
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-4 text-white">Loading Analytics...</div>;
  if (!data) return <div className="text-center p-4 text-red-500">Failed to load analytics.</div>;

  const stats = [
    {
      title: 'Total Scans',
      value: data.totalScans.toLocaleString(),
      icon: Eye,
      change: '+12.5%',
      color: 'text-primary',
    },
    {
      title: 'Unique Users',
      value: data.uniqueUsers.toLocaleString(),
      icon: Users,
      change: '+8.3%',
      color: 'text-secondary',
    },
    {
      title: 'Avg. Time Spent',
      value: data.averageTime,
      icon: Clock,
      change: '+15.2%',
      color: 'text-success',
    },
    {
      title: 'Conversion Rate',
      value: `${data.conversionRate}%`,
      icon: TrendingUp,
      change: '+5.7%',
      color: 'text-warning',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold gradient-text">Campaign Analytics</h2>
        <p className="text-muted-foreground">
          Real-time insights into your AR campaign performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-1 text-sm">
                  <span className="text-success">{stat.change}</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Static Analytics (optional: can be made dynamic later) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="gradient-text">Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[{ region: 'North America', percentage: 45 },
              { region: 'Europe', percentage: 32 },
              { region: 'Asia Pacific', percentage: 18 },
              { region: 'Others', percentage: 5 },
            ].map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{region.region}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {region.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="gradient-text">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[{ device: 'Mobile', percentage: 68, icon: '📱' },
              { device: 'Tablet', percentage: 22, icon: '📊' },
              { device: 'Desktop', percentage: 10, icon: '💻' },
            ].map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>{device.icon}</span>
                  <span className="text-sm font-medium">{device.device}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
