import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, 
  Search, 
  EyeOff, 
  Calendar,
  User,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface FeedbackRow {
  id: string;
  rating: number;
  message: string | null;
  email: string | null;
  created_at: string;
}

const AdminRatings = () => {
  const [ratings, setRatings] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load feedback:', error);
          toast.error('Failed to load ratings');
        } else if (data) {
          setRatings(data);
        }
        setLoading(false);
      });
  }, []);

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratings.filter(r => r.rating === star).length,
    percentage: ratings.length > 0 
      ? (ratings.filter(r => r.rating === star).length / ratings.length) * 100 
      : 0
  }));

  const filteredRatings = ratings.filter(r => {
    const matchesSearch = !searchTerm || 
      (r.message?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRating = filterRating === 'all' || r.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  const sortedRatings = [...filteredRatings].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'highest': return b.rating - a.rating;
      case 'lowest': return a.rating - b.rating;
      default: return 0;
    }
  });

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'lg' ? 24 : 16;
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Ratings</h1>
            <p className="text-muted-foreground">Monitor customer feedback and satisfaction</p>
          </div>
          <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
            <Star className="mr-2" size={20} />
            {averageRating.toFixed(1)} from {ratings.length} ratings
          </Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2" size={20} />
                    Rating Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {averageRating.toFixed(1)}
                      </div>
                      {renderStars(Math.round(averageRating), 'lg')}
                      <p className="text-muted-foreground mt-2">
                        Based on {ratings.length} reviews
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rating Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ratingBreakdown.map(({ star, count, percentage }) => (
                      <div key={star} className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-8">{star}★</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search ratings..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                  <Select value={filterRating} onValueChange={setFilterRating}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest">Highest Rating</SelectItem>
                      <SelectItem value="lowest">Lowest Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedRatings.map((rating) => (
                <Card key={rating.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-muted-foreground" />
                        <span className="font-medium">
                          {rating.email ? rating.email.split('@')[0] : 'Anonymous'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">{renderStars(rating.rating)}</div>

                    {rating.message && (
                      <p className="text-foreground mb-4 text-sm leading-relaxed">
                        &ldquo;{rating.message}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{format(new Date(rating.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sortedRatings.length === 0 && (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Star size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No ratings found matching your criteria</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRatings;