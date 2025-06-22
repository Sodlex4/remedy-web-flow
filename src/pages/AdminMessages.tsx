
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MessageCircle, 
  Clock, 
  ExternalLink,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Message {
  id: string;
  customerName: string;
  email?: string;
  whatsappNumber?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  source: 'contact' | 'whatsapp';
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reply, setReply] = useState('');

  // Mock data - replace with Supabase
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        customerName: 'John Doe',
        email: 'john@example.com',
        whatsappNumber: '+254700123456',
        message: 'Hi, I wanted to ask about your Blue Dream strain availability and pricing. When would be the best time for pickup?',
        createdAt: '2025-01-21T14:30:00Z',
        isRead: false,
        source: 'contact'
      },
      {
        id: '2',
        customerName: 'Sarah Johnson',
        whatsappNumber: '+254701234567',
        message: 'Hello! I\'m interested in Girl Scout Cookies. Do you have any in stock? Also, what are your pickup hours?',
        createdAt: '2025-01-21T12:15:00Z',
        isRead: true,
        source: 'whatsapp'
      },
      {
        id: '3',
        customerName: 'Mike Wilson',
        email: 'mike.w@gmail.com',
        message: 'Great service last time! Can I get the same order as before? Blue Dream 2g + papers.',
        createdAt: '2025-01-20T16:45:00Z',
        isRead: false,
        source: 'contact'
      }
    ];
    setMessages(mockMessages);
    setSelectedMessage(mockMessages[0]);
  }, []);

  const filteredMessages = messages.filter(msg => 
    msg.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
    toast.success('Message marked as read');
  };

  const markAllAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
    toast.success('All messages marked as read');
  };

  const handleWhatsAppReply = (whatsappNumber: string) => {
    const message = encodeURIComponent(reply || 'Hello! Thank you for contacting Nature\'s Remedy. How can I assist you today?');
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setReply('');
    toast.success('WhatsApp opened for reply');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground">Manage customer conversations</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={unreadCount > 0 ? "destructive" : "secondary"}>
              {unreadCount} unread
            </Badge>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Messages Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inbox</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.isRead) {
                          markAsRead(message.id);
                        }
                      }}
                      className={`p-4 cursor-pointer border-b border-border hover:bg-muted/50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-muted' : ''
                      } ${!message.isRead ? 'border-l-4 border-l-primary' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className={`font-medium truncate ${!message.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {message.customerName}
                            </p>
                            {!message.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {message.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {message.source}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center space-x-2">
                        <User size={20} />
                        <span>{selectedMessage.customerName}</span>
                      </CardTitle>
                      <div className="space-y-1">
                        {selectedMessage.email && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Mail size={14} />
                            <span>{selectedMessage.email}</span>
                          </div>
                        )}
                        {selectedMessage.whatsappNumber && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone size={14} />
                            <span>{selectedMessage.whatsappNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock size={14} />
                          <span>{format(new Date(selectedMessage.createdAt), 'MMMM d, yyyy at h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={selectedMessage.source === 'whatsapp' ? 'default' : 'secondary'}>
                      {selectedMessage.source}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Message Content */}
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Reply Section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Reply</h3>
                    <Textarea
                      placeholder="Type your reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex space-x-3">
                      {selectedMessage.whatsappNumber && (
                        <Button
                          onClick={() => handleWhatsAppReply(selectedMessage.whatsappNumber!)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <MessageCircle size={16} className="mr-2" />
                          Reply via WhatsApp
                        </Button>
                      )}
                      {selectedMessage.email && (
                        <Button
                          onClick={() => {
                            const subject = encodeURIComponent('Re: Your message to Nature\'s Remedy');
                            const body = encodeURIComponent(reply || 'Thank you for contacting Nature\'s Remedy...');
                            window.open(`mailto:${selectedMessage.email}?subject=${subject}&body=${body}`, '_blank');
                            setReply('');
                            toast.success('Email client opened');
                          }}
                          variant="outline"
                        >
                          <Mail size={16} className="mr-2" />
                          Reply via Email
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Select a message to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
