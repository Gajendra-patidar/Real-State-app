const fs = require('fs');
const file = 'src/screens/shared/NotificationsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldRenderItem = `  const renderItem = ({ item }: { item: any }) => {
    const isRead = item.isRead || item.read_at !== null && item.read_at !== undefined;
    const title = item.title || item.data?.title || 'Notification';
    const message = item.message || item.data?.message || item.body || '';
    const type = item.type || item.data?.type || 'default';
    const time = item.time || item.created_at || '';`;

const newRenderItem = `  const formatTitle = (type: string) => {
    if (!type) return 'Notification';
    const words = type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1));
    return words.join(' ');
  };

  const renderItem = ({ item }: { item: any }) => {
    const isRead = item.isRead || (item.read_at !== null && item.read_at !== undefined);
    const title = item.title || item.metadata?.title || item.data?.title || formatTitle(item.activity_type);
    const message = item.message || item.metadata?.message || item.description || item.data?.message || item.body || '';
    const type = item.activity_type || item.type || item.data?.type || 'default';
    const time = item.time || item.created_at || '';`;

content = content.replace(oldRenderItem, newRenderItem);

// Wait, I should also update renderIcon and getIconBg to handle these activity_types
const oldRenderIcon = `  const renderIcon = (type: string) => {
    switch (type) {
      case 'lead_assigned': return <UserPlus size={20} color={colors.primary} />;
      case 'message': return <MessageSquare size={20} color={colors.info} />;
      case 'lead_converted': return <CheckCircle2 size={20} color={colors.success} />;
      case 'task': return <Clock size={20} color={colors.warning} />;
      default: return <Bell size={20} color={colors.textMuted} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'lead_assigned': return colors.primary + '15';
      case 'message': return colors.infoLight;
      case 'lead_converted': return colors.successLight;
      case 'task': return colors.warningLight;
      default: return colors.background;
    }
  };`;

const newRenderIcon = `  const renderIcon = (type: string) => {
    if (type.includes('assign')) return <UserPlus size={20} color={colors.primary} />;
    if (type.includes('message')) return <MessageSquare size={20} color={colors.info} />;
    if (type.includes('convert') || type.includes('booking')) return <CheckCircle2 size={20} color={colors.success} />;
    if (type.includes('visit') || type.includes('follow') || type.includes('task')) return <Clock size={20} color={colors.warning} />;
    return <Bell size={20} color={colors.textMuted} />;
  };

  const getIconBg = (type: string) => {
    if (type.includes('assign')) return colors.primary + '15';
    if (type.includes('message')) return colors.infoLight;
    if (type.includes('convert') || type.includes('booking')) return colors.successLight;
    if (type.includes('visit') || type.includes('follow') || type.includes('task')) return colors.warningLight;
    return colors.background;
  };`;

content = content.replace(oldRenderIcon, newRenderIcon);

// One thing about Laravel pagination JSON: earlier I wrote
/*
      if (Array.isArray(response)) {
        notifs = response;
      } else if (response?.data && Array.isArray(response.data)) {
        notifs = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        notifs = response.data.data;
      } else if (response?.notifications && Array.isArray(response.notifications)) {
        notifs = response.notifications;
      }
*/
// The JSON has the array in `data`. My logic will hit:
// else if (response?.data && Array.isArray(response.data)) { notifs = response.data; }
// which is perfectly correct!

fs.writeFileSync(file, content);
console.log('Fixed notification payload mappings');
