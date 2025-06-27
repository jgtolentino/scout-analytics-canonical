import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertCircle, Target } from 'lucide-react';

interface Recommendation {
  type: 'insight' | 'action' | 'alert' | 'opportunity';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  metric?: string;
}

interface AIRecommendationPanelProps {
  context: string;
  recommendations?: Recommendation[];
}

const defaultRecommendations: Record<string, Recommendation[]> = {
  'transaction-trends': [
    {
      type: 'insight',
      title: 'Peak Hours Optimization',
      description: 'Transaction volume peaks at 6PM-9PM. Consider increasing staff during these hours.',
      priority: 'high',
      metric: '+23% potential efficiency'
    },
    {
      type: 'opportunity',
      title: 'Weekend Revenue Boost',
      description: 'Weekend transactions are 23% higher. Launch weekend-specific promotions.',
      priority: 'medium',
      metric: '₱125K additional revenue'
    },
    {
      type: 'alert',
      title: 'Morning Slowdown',
      description: 'Morning transactions decreased by 15% this month. Investigate potential causes.',
      priority: 'high'
    }
  ],
  'product-mix': [
    {
      type: 'action',
      title: 'High Substitution Alert',
      description: 'Marlboro to Fortune substitution is high (200/month). Ensure Marlboro stock.',
      priority: 'high',
      metric: '₱45K revenue at risk'
    },
    {
      type: 'insight',
      title: 'Bundle Opportunity',
      description: 'Yosi + Max Coffee combo occurs in 78% of tobacco purchases. Create bundle offer.',
      priority: 'medium',
      metric: '+₱15 per transaction'
    },
    {
      type: 'opportunity',
      title: 'Category Expansion',
      description: 'Personal care has only 8% share but growing 12% MoM. Expand SKU range.',
      priority: 'medium'
    }
  ],
  'consumer-behavior': [
    {
      type: 'insight',
      title: 'Suggestion Acceptance High',
      description: '68% accept store owner suggestions. Train staff on upselling techniques.',
      priority: 'high',
      metric: '+₱45 avg basket'
    },
    {
      type: 'action',
      title: 'Verbal Request Training',
      description: '60% use verbal requests. Ensure staff knows all product names and variants.',
      priority: 'medium'
    },
    {
      type: 'opportunity',
      title: 'Decision Time Reduction',
      description: 'Average decision time is 2.1 seconds. Clear product displays can reduce this.',
      priority: 'low'
    }
  ],
  'consumer-profiling': [
    {
      type: 'insight',
      title: 'Youth Market Growing',
      description: '45% are 18-34 years old, up 12% YoY. Focus on youth-oriented products.',
      priority: 'high',
      metric: '18-34 segment'
    },
    {
      type: 'opportunity',
      title: 'Regional Expansion',
      description: 'NCR shows highest avg basket (₱285). Consider opening more stores there.',
      priority: 'high',
      metric: '₱40 higher basket'
    },
    {
      type: 'action',
      title: 'Gender-Based Marketing',
      description: 'Male customers at 58%. Consider male-targeted promotions for key categories.',
      priority: 'medium'
    }
  ]
};

export const AIRecommendationPanel: React.FC<AIRecommendationPanelProps> = ({ 
  context, 
  recommendations = defaultRecommendations[context] || [] 
}) => {
  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'insight':
        return <Lightbulb className="h-5 w-5" />;
      case 'action':
        return <Target className="h-5 w-5" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5" />;
      case 'opportunity':
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'insight':
        return 'text-blue-600 bg-blue-50';
      case 'action':
        return 'text-green-600 bg-green-50';
      case 'alert':
        return 'text-red-600 bg-red-50';
      case 'opportunity':
        return 'text-purple-600 bg-purple-50';
    }
  };

  const getPriorityBadge = (priority: Recommendation['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Recommendations</h3>
        <span className="text-sm text-gray-500">{recommendations.length} suggestions</span>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded ${getTypeColor(rec.type)}`}>
                {getIcon(rec.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  {getPriorityBadge(rec.priority)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                {rec.metric && (
                  <p className="text-sm font-medium text-blue-600">{rec.metric}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};