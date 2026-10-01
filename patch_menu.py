import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/manager/ManagerMenuScreen.tsx', 'r') as f:
    content = f.read()

# Add useState to react import
content = content.replace("import React from 'react';", "import React, { useState } from 'react';")

# Add ExpandableMenuItem component
expandable_comp = """
const ExpandableMenuItem = ({ icon, title, iconColor = colors.primary, subItems, isLast = false }: { icon: string, title: string, iconColor?: string, subItems: {title: string, routeName?: string}[], isLast?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <View style={!isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <TouchableOpacity 
        style={[styles.menuItem, { borderBottomWidth: 0 }]} 
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={[styles.iconBox, { backgroundColor: iconColor + '15' }]}>
          <Icon name={icon} size={22} color={iconColor} />
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
        <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={{ backgroundColor: '#F8FAFC', paddingBottom: spacing.s }}>
          {subItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={{ paddingVertical: 12, paddingLeft: 64, paddingRight: spacing.m, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                if (item.routeName) {
                  navigation.navigate(item.routeName);
                } else {
                  Alert.alert('Coming Soon', `${item.title} is not yet implemented.`);
                }
              }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: iconColor, marginRight: 12, opacity: 0.5 }} />
              <Text style={{ fontSize: typography.sizes.m, color: colors.textSecondary, fontWeight: '500' }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
"""

content = content.replace("export const ManagerMenuScreen", expandable_comp + "\nexport const ManagerMenuScreen")

# Replace HRMS item
hrms_old = '<MenuItem icon="account-group" title="HRMS" iconColor="#3B82F6" />'
hrms_new = """<ExpandableMenuItem 
            icon="account-clock" 
            title="HRMS" 
            iconColor="#3B82F6" 
            subItems={[
              { title: 'Dashboard' },
              { title: 'Staff Directory' },
              { title: 'Attendance' },
              { title: 'Leave Management' },
              { title: 'Payroll & Salary' }
            ]}
          />"""

content = content.replace(hrms_old, hrms_new)

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/manager/ManagerMenuScreen.tsx', 'w') as f:
    f.write(content)
