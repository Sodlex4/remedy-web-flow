import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface PickupOverviewProps {
  loading: boolean;
  thisWeekPickups: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  countyFilter: string;
  setCountyFilter: (county: string) => void;
  counties: string[];
}

const PickupOverview = ({
  loading,
  thisWeekPickups,
  pendingCount,
  confirmedCount,
  completedCount,
  filterStatus,
  setFilterStatus,
  searchTerm,
  setSearchTerm,
  countyFilter,
  setCountyFilter,
  counties,
}: PickupOverviewProps) => {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-green-600/10 border-primary/20">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {loading ? 'Loading...' : `Live Data: ${thisWeekPickups} Pickups`}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-red-500 text-white">Pending: {pendingCount}</Badge>
              <Badge className="bg-yellow-500 text-white">Confirmed: {confirmedCount}</Badge>
              <Badge className="bg-green-500 text-white">Completed: {completedCount}</Badge>
            </div>
          </div>
          <div className="md:col-span-2 space-y-3">
            <div className="flex gap-2">
              <select
                value={countyFilter}
                onChange={(e) => setCountyFilter(e.target.value)}
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm"
              >
                <option value="all">All Counties</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="seen">Seen</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PickupOverview;
