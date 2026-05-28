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
  User,
  Mail,
  Phone,
  Loader2,
  Circle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [readLoading, setReadLoading] = useState<string | null>(null);

  const handleSelectMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      setReadLoading(message.id);
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', message.id);
      if (error) {
        console.error('Failed to mark message as read:', error);
      } else {
        setMessages(prev =>
          prev.map(m => m.id === message.id ? { ...m, is_read: true } : m)
        );
      }
      setReadLoading(null);
    }
  };

  useEffect(() => {
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load messages:', error);
          toast.error('Failed to load messages');
        } else if (data && data.length > 0) {
          setMessages(data);
          setSelectedMessage(data[0]);
        }
        setLoading(false);
      });
  }, []);

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWhatsAppReply = (email: string) => {
    const message = encodeURIComponent(reply || 'Hello! Thank you for contacting us. How can I assist you today?');
    const whatsappUrl = `https://wa.me/${email.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setReply('');
    toast.success('WhatsApp opened for reply');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground">Customer inquiries from the contact form</p>
          </div>
          <Badge variant={messages.length > 0 ? "default" : "secondary"}>
            {messages.length} total
          </Badge>
        </div>

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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inbox</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle size={32} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => handleSelectMessage(message)}
                          className={`p-4 cursor-pointer border-b border-border hover:bg-muted/50 transition-colors ${
                            selectedMessage?.id === message.id ? 'bg-muted' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                {!message.is_read && (
                                  <Circle size={8} className="fill-primary text-primary flex-shrink-0" />
                                )}
                                {readLoading === message.id && (
                                  <Loader2 size={12} className="animate-spin text-muted-foreground flex-shrink-0" />
                                )}
                                <p className={`font-medium truncate ${selectedMessage?.id === message.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {message.name}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground truncate mt-1">
                                {message.subject}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(message.created_at), 'MMM d, h:mm a')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedMessage ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center space-x-2">
                          <User size={20} />
                          <span>{selectedMessage.name}</span>
                        </CardTitle>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Mail size={14} />
                            <span>{selectedMessage.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock size={14} />
                            <span>{format(new Date(selectedMessage.created_at), 'MMMM d, yyyy at h:mm a')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Subject: {selectedMessage.subject}</p>
                      <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Reply</h3>
                      <Textarea
                        placeholder="Type your reply..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => {
                            const subject = encodeURIComponent(`Re: ${selectedMessage.subject}`);
                            const body = encodeURIComponent(reply || 'Thank you for contacting us...');
                            window.open(`mailto:${selectedMessage.email}?subject=${subject}&body=${body}`, '_blank');
                            setReply('');
                            toast.success('Email client opened');
                          }}
                          variant="outline"
                        >
                          <Mail size={16} className="mr-2" />
                          Reply via Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No messages to display</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;