
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock,
  FileText,
  CheckCircle,
  Package
} from 'lucide-react';

interface StatsCardsProps {
  newRequestsCount: number;
  totalRequests: number;
  confirmedCount: number;
  completedCount: number;
  totalValue: number;
}

const StatsCards = ({
  newRequestsCount,
  totalRequests,
  confirmedCount,
  completedCount,
  totalValue
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card dark:bg-card border-border dark:border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground dark:text-muted-foreground text-sm">New Requests</p>
              <p className="text-3xl font-bold text-foreground dark:text-foreground">{newRequestsCount}</p>
            </div>
            <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center">
              <Clock className="text-red-500" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card dark:bg-card border-border dark:border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground dark:text-muted-foreground text-sm">Total Requests</p>
              <p className="text-3xl font-bold text-foreground dark:text-foreground">{totalRequests}</p>
            </div>
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center">
              <FileText className="text-primary" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card dark:bg-card border-border dark:border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground dark:text-muted-foreground text-sm">Ready for Pickup</p>
              <p className="text-3xl font-bold text-foreground dark:text-foreground">{confirmedCount}</p>
            </div>
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card dark:bg-card border-border dark:border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground dark:text-muted-foreground text-sm">Total Value</p>
              <p className="text-3xl font-bold text-foreground dark:text-foreground">
                KSh {totalValue.toLocaleString()}
              </p>
            </div>
            <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
              <Package className="text-yellow-500" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
