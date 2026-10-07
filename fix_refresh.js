const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveBookingsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldRender = `      {loading ? (
        <View style={styles.center}>
           <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderBookingCard}
          contentContainerStyle={{ padding: spacing.m, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Icon name="file-document-outline" size={48} color={colors.border} />
              <Text style={{marginTop: 10, color: colors.textSecondary}}>No bookings found.</Text>
            </View>
          }
        />
      )}`;

const newRender = `      <FlatList
        data={bookings}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderBookingCard}
        contentContainerStyle={bookings.length === 0 ? { flex: 1, padding: spacing.m } : { padding: spacing.m, paddingBottom: 100 }}
        refreshing={loading}
        onRefresh={fetchBookings}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.center}>
              <Icon name="file-document-outline" size={48} color={colors.border} />
              <Text style={{marginTop: 10, color: colors.textSecondary}}>No bookings found.</Text>
            </View>
          ) : null
        }
      />`;

content = content.replace(oldRender, newRender);

fs.writeFileSync(file, content);
console.log('Added pull to refresh');
